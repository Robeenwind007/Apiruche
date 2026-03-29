# ApiRuche — Principauté de Cordemais
## Documentation technique v2.5.0

---

## Présentation

ApiRuche est une Progressive Web App (PWA) de gestion apicole déployée sur GitHub Pages avec Supabase comme backend. L'application est entièrement contenue dans un seul fichier `index.html` — CSS, JavaScript et HTML intégrés — sans dépendance à un framework ni processus de build.

---

## Architecture

| Élément | Technologie |
|---|---|
| Frontend | HTML/CSS/JS vanilla, single-file |
| Backend | Supabase (PostgreSQL + Storage) |
| Déploiement | GitHub Pages |
| Persistance locale | localStorage (cache + config) |
| Notifications | CallMeBot (WhatsApp API) |

---

## Structure Supabase

### Tables

| Table | Rôle |
|---|---|
| `ruches` | Ruches du rucher (id, nom, type, photo_url, actif, cadre_males, remerage_division…) |
| `colonies` | Colonies avec génétique, couleur reine, marquage, date_creation, date_fin |
| `occupations` | Historique des occupations colonie ↔ ruche |
| `occupation_courante` | Vue ou table filtrée : occupations sans date_fin |
| `pesees` | Pesées (demi_pesee, pesee, nb_cadres, nb_hausse, ratio, semaine) |
| `hausses` | Hausses posées (hausse_ref, ruche_id, date_pose, poids_ref, date_retrait, poids_retrait, poids_miel, variete) |
| `nourrissements` | Nourrissements multi-ruches (type, quantite, semaine) |
| `traitements` | Traitements varroa (type, semaine, date_fin) |
| `actions` | Actions rucher libres (type, notes, semaine) |
| `recoltes` | Récoltes miel (poids_miel, variete, semaine) |
| `conditionnements` | Conditionnements (nb_pots, type_pot, variete) |
| `achats` | Achats matériel/consommables (fournisseur, type_achat, montant_ttc, **facture_url**) |
| `pieges_frelons` | Pièges frelons asiatiques (ruche_id, date_pose, nb_captures) |
| `comptages_varroa` | Comptages varroa (colonie_id, nb_abeilles, nb_varroa) |
| `ruchers` | Ruchers (nom, adresse) |
| `fiche_apiculteur` | Fiche apiculteur (prenom, nom, napi, siret, email, telephone) |

### Migrations nécessaires

```sql
-- Colonne facture PDF pour les achats
ALTER TABLE public.achats ADD COLUMN IF NOT EXISTS facture_url text;
```

### Storage Supabase

| Bucket | Usage | Visibilité |
|---|---|---|
| `ruches-images` | Photos des ruches | Public |
| `achats-factures` | Factures PDF des achats | Public |

**Policies Storage à créer pour `achats-factures` :**

```sql
-- Upload
CREATE POLICY "Allow upload achats-factures"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'achats-factures');

-- Lecture
CREATE POLICY "Allow read achats-factures"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'achats-factures');
```

---

## Fonctionnalités

### 🐝 Ruches
- Liste avec photo, statut colonie, dernière pesée, variation de poids, badges hausses actives
- Filtre actives / toutes
- Photo modifiable via Supabase Storage
- Navigation prev/next entre ruches
- Fiche détail : historique pesées, hausses en cours avec miel estimé, actions, traitements, nourrissements, comptages varroa

### 👑 Colonies
- Liste avec couleur reine, génétique, ruche d'occupation
- Fiche détail : occupation actuelle, déplacement vers une autre ruche, gentillesse (étoiles), historique complet
- Création / fin de colonie

### ⚖️ Pesées
- Saisie demi-pesée avec calcul automatique (pesée totale, ratio kg/cadre)
- Pré-remplissage nb cadres et hausses depuis la dernière pesée
- Clavier numérique (`inputmode="decimal"`)

### 🍯 Production (Hausses)
- **Compteurs en haut de page** : Récolté année en cours + Miel en cours (somme toutes hausses actives)
- Pose de hausse : référence, ruche, date, poids de référence (pré-rempli depuis la pesée)
- Retrait avec calcul automatique du miel récolté : `poids_retrait − poids_ref − autres_retraits_depuis_pose`
- Miel estimé en temps réel sur chaque hausse active
- Historique chronologique poses + retraits
- Accès direct depuis le menu Production → bouton "+ Poser une hausse"

### 🍽️ Nourrissement
- Multi-ruches avec sélection par case à cocher
- Types configurables dans les listes

### 💊 Traitements & Actions
- Multi-ruches, types configurables
- Cadre à mâles et remérage/division avec suivi de durée

### 🔬 Varroa
- Comptage par colonie, calcul du taux d'infestation

### 🪲 Frelons
- Suivi des pièges par ruche, comptage captures

### 🛍️ Achats
- Saisie avec fournisseur, type, montant TTC
- **Facture PDF** : upload au moment de la création ou a posteriori via bouton "Joindre"
- **Modification et suppression** via bottom sheet (clic sur la ligne)
- Remplacement de facture possible depuis le sheet d'édition
- Total annuel affiché

### 📊 Dashboard
- Nb ruches actives, colonies, hausses en place
- Miel estimé total en cours, miel récolté année
- Stock par variété

### 🔔 Alertes au démarrage
- Cadre à mâles > 14 jours
- Remérage/division > 14 jours
- Conditions favorables pour poser une hausse (poids ≥ 32 kg + cadres ≥ 8 + aucune hausse en place)
- Bouton "Ne plus afficher" : sauvegarde immédiate au cochage (localStorage)
- Envoi optionnel via WhatsApp (CallMeBot)

### 🏠 Splash screen
- Logo en hexagone SVG avec effet de relief (gradients, reflets, ombre)
- **Statistiques temps réel** sous le bouton Entrer : ruches actives, hausses en cours, récolté année, miel en cours
- Données chargées depuis le cache localStorage dès l'ouverture

### ⚙️ Paramétrage
- Rucher (nom, adresse), nouvelle ruche, activation/désactivation
- Fiche apiculteur (NAPI, SIRET, contact)
- Listes configurables : types ruche, traitement, nourriture, action, variété miel, références hausses
- Configuration Supabase (URL + clé anon)
- Configuration WhatsApp (CallMeBot)
- Export JSON / Import JSON / Vider le cache

---

## Calcul du miel estimé

Pour chaque hausse active :

```
miel_estimé = dernière_pesée_ruche_depuis_pose
            − poids_ref_hausse
            − Σ(poids_miel des autres hausses retirées depuis la date_pose)
```

Ce calcul est appliqué à 4 endroits : dashboard, liste des hausses actives (écran Production), fiche ruche, formulaire de retrait.

---

## Alertes — logique snooze

Les alertes sont calculées à l'ouverture du splash (`checkAlertesDemarrage`). Les clés snooze sont stockées dans `localStorage['ruches_alertes_snooze']` sous la forme `"nom_ruche|type_alerte"`.

La purge des snoozes obsolètes ne s'exécute que si `DB.ruches.length > 0` (données chargées), pour éviter d'effacer les préférences en cas de cache vide au démarrage.

---

## Déploiement

```bash
# Cloner le dépôt
git clone https://github.com/Robeenwind007/apiruche.git

# Déployer sur GitHub Pages
git add index.html
git commit -m "v2.5.0"
git push origin main
```

L'application est disponible à l'URL GitHub Pages du dépôt. Aucun processus de build requis.

---

## Versioning

| Version | Date | Changements principaux |
|---|---|---|
| 2.5.0 | Mars 2026 | Upload factures PDF sur achats, édition/suppression achats, badges hausses dans liste ruches, stats splash screen, logo hexagonal en relief, compteurs production en haut de page, corrections snooze alertes, inputmode numérique |
| 2.4.x | Mars 2026 | Hausses et production miel, paramétrage complet, WhatsApp alertes, fiche apiculteur |
| 2.0.x | Fév. 2026 | Migration Supabase, colonies, dashboard, historique |
| 1.x | Jan. 2026 | Version initiale localStorage |

---

*ApiRuche — Principauté de Cordemais — usage personnel*
