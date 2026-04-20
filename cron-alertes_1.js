// ============================================================
// ApiRuche — CRON WhatsApp
// Vérifie les alertes rucher et envoie un message WhatsApp
// si des conditions sont remplies.
// Déclenché par GitHub Actions tous les jours à midi.
// ============================================================

const SUPABASE_URL   = process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_KEY;
const WA_PHONE       = process.env.WA_PHONE;
const WA_APIKEY      = process.env.WA_APIKEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !WA_PHONE || !WA_APIKEY) {
  console.error('Variables d\'environnement manquantes. Vérifiez les secrets GitHub.');
  process.exit(1);
}

// Fetch Supabase
async function sb(table, params = '') {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  if (!r.ok) throw new Error(`Supabase ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

// Envoyer WhatsApp via Callmebot
async function sendWhatsApp(msg) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(WA_PHONE)}&text=${encodeURIComponent(msg)}&apikey=${encodeURIComponent(WA_APIKEY)}`;
  const r = await fetch(url);
  console.log('WhatsApp status:', r.status);
}

// Normaliser (supprimer accents pour compatibilité WhatsApp)
function normalize(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Poids estimé d'une hausse en cours via les pesées
// Même logique que poidsEstimeHausse() dans l'app
function poidsEstimeHausse(h, pesees, toutesHausses) {
  if (!h.poids_ref) return null;
  const peseesFiltrees = pesees
    .filter(p => p.ruche_id === h.ruche_id && p.semaine >= h.date_pose)
    .sort((a, b) => new Date(b.semaine) - new Date(a.semaine));
  if (!peseesFiltrees.length) return null;
  const p = peseesFiltrees[0];
  const dernPoids = p.pesee != null ? parseFloat(p.pesee) : (p.demi_pesee != null ? parseFloat(p.demi_pesee) * 2 : NaN);
  if (isNaN(dernPoids)) return null;
  const autresRetrait = toutesHausses
    .filter(x => x.id !== h.id && x.ruche_id === h.ruche_id && x.date_retrait && x.date_retrait >= h.date_pose && x.poids_miel)
    .reduce((acc, x) => acc + parseFloat(x.poids_miel), 0);
  return Math.max(0, dernPoids - parseFloat(h.poids_ref) - autresRetrait);
}

async function main() {
  console.log('--- ApiRuche CRON', new Date().toISOString(), '---');

  // Charger les données nécessaires
  const [ruches, occupations, pesees, haussesEnCours, toutesHausses] = await Promise.all([
    sb('ruches', 'actif=neq.false&select=id,nom,cadre_males,date_cadre_males,remerage_division,date_remerage_division'),
    sb('occupations', 'date_fin=is.null&select=ruche_id,colonie_id'),
    sb('pesees', 'select=id,ruche_id,semaine,pesee,demi_pesee,nb_cadres,nb_hausse&order=semaine.desc&limit=500'),
    sb('hausses', 'date_retrait=is.null&select=id,ruche_id,hausse_ref,date_pose,poids_ref'),
    sb('hausses', 'select=id,ruche_id,hausse_ref,date_pose,date_retrait,poids_ref,poids_miel'),
  ]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const alertes = [];

  // ── Alertes ruches ──────────────────────────────────────────
  ruches.forEach(r => {
    // --- Cadre à mâles ---
    if (r.cadre_males && r.date_cadre_males) {
      const debut = new Date(r.date_cadre_males);
      const diff  = Math.floor((today - debut) / 86400000);
      if (diff > 14) {
        const fin = new Date(debut); fin.setDate(fin.getDate() + 21);
        alertes.push({
          emoji:  '🐝',
          nom:    r.nom || r.id,
          action: 'Cadre a males',
          label:  `${diff}j - Retrait prevu le ${fin.toLocaleDateString('fr-FR')}`
        });
      }
    }

    // --- Remérage/Division ---
    if (r.remerage_division && r.date_remerage_division) {
      const debut = new Date(r.date_remerage_division);
      const diff  = Math.floor((today - debut) / 86400000);
      if (diff >= 14) {
        const finPrevue = new Date(debut); finPrevue.setDate(finPrevue.getDate() + 28);
        const naiss     = new Date(debut); naiss.setDate(naiss.getDate() + 14);
        const label = diff >= 28
          ? 'Remerage termine - verifier la reine'
          : `Naissance reine le ${naiss.toLocaleDateString('fr-FR')} - fin prevue ${finPrevue.toLocaleDateString('fr-FR')}`;
        alertes.push({ emoji: '👑', nom: r.nom || r.id, action: 'Remerage/Division', label });
      }
    }

    // --- Poser une hausse ---
    const haussesRuche = haussesEnCours.filter(h => h.ruche_id === r.id);
    if (haussesRuche.length === 0) {
      const pRuche = pesees
        .filter(p => p.ruche_id === r.id)
        .sort((a, b) => new Date(b.semaine) - new Date(a.semaine));
      if (pRuche.length) {
        const p     = pRuche[0];
        const poids = p.pesee != null ? parseFloat(p.pesee) : (p.demi_pesee != null ? parseFloat(p.demi_pesee) * 2 : NaN);
        const cadres = p.nb_cadres || 0;
        if (!isNaN(poids) && poids >= 32 && cadres >= 8) {
          alertes.push({
            emoji:  '🍯',
            nom:    r.nom || r.id,
            action: 'Poser une hausse',
            label:  `${poids.toFixed(1)} kg - ${cadres} cadres - conditions reunies`
          });
        }
      }
    }
  });

  // ── Alertes hausses ─────────────────────────────────────────
  const haussesARecolter = [];
  const haussesADoubler  = [];

  haussesEnCours.forEach(h => {
    const poids = poidsEstimeHausse(h, pesees, toutesHausses);
    if (poids == null) return;
    const ruche = ruches.find(r => r.id === h.ruche_id);
    const nom   = ruche ? (ruche.nom || ruche.id) : h.ruche_id;
    if (poids >= 12) {
      haussesARecolter.push({ ref: h.hausse_ref, nom, poids });
    } else if (poids >= 9) {
      haussesADoubler.push({ ref: h.hausse_ref, nom, poids });
    }
  });

  if (haussesARecolter.length) {
    haussesARecolter.sort((a,b) => a.ref.localeCompare(b.ref));
    alertes.push({
      emoji:  '✅',
      nom:    'Hausses a recolter',
      action: haussesARecolter.map(h => `${h.ref} (${normalize(h.nom)} - ${h.poids.toFixed(1)} kg)`).join(', '),
      label:  null
    });
  }

  if (haussesADoubler.length) {
    haussesADoubler.sort((a,b) => a.ref.localeCompare(b.ref));
    alertes.push({
      emoji:  '🟠',
      nom:    'Hausses a doubler',
      action: haussesADoubler.map(h => `${h.ref} (${normalize(h.nom)} - ${h.poids.toFixed(1)} kg)`).join(', '),
      label:  null
    });
  }

  // ── Envoi ────────────────────────────────────────────────────
  console.log(`${alertes.length} alerte(s) detectee(s)`);

  if (!alertes.length) {
    console.log('Aucune alerte, pas de message envoye.');
    return;
  }

  const lignes = alertes.map(a => {
    let txt = `${a.emoji} *${normalize(a.nom)}*`;
    if (a.action) txt += ` - ${normalize(a.action)}`;
    if (a.label)  txt += `\n   ${normalize(a.label)}`;
    return txt;
  });

  const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const msg = `*ApiRuche - Alertes rucher*\n${dateStr}\n\n` + lignes.join('\n\n');

  console.log('Message a envoyer:\n', msg);
  await sendWhatsApp(msg);
  console.log('Message envoye avec succes.');
}

main().catch(e => { console.error('ERREUR:', e); process.exit(1); });
