# ApiRuche — Principauté de Cordemais
## Documentation technique v2.6.0

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
| `hausses` | Hausses posées (hausse_ref, ruche_id, date_pose, poids_ref, date_retrait, poids_retrait, poids_miel, variete, **num_lot**) |
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

-- Numéro de lot pour les hausses (récolte)
ALTER TABLE public.hausses ADD COLUMN IF NOT EXISTS num_lot text;
```

### Storage Supabase

| Bucket | Usage | Visibilité |
|---|---|---|
| `ruches-images` | Photos des ruches | Public |
| `achats-factures` | Factures PDF des achats | Public |

**Policies Storage pour `achats-factures` :**

```sql
CREATE POLICY "Allow upload achats-factures"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'achats-factures');

CREATE POLICY "Allow read achats-factures"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'achats-factures');
```

---

## Fonctionnalités

### Ruches
- Liste avec photo, statut colonie, dernière pesée, variation de poids, badges hausses actives sous le poids
- Filtre actives / toutes, navigation prev/next
- Photo modifiable via Supabase Storage
- Fiche détail : pesées, hausses avec miel estimé, actions, traitements, nourrissements, varroa

### Colonies
- Liste : ruche d'occupation en premier, génétique, pastille couleur reine inline dans le nom
- Pastille avec coche SVG blanche si reine marquée, couleur jaune `#e6db0c`
- Fiche détail : occupation, déplacement, gentillesse, historique complet

### Pesées
- Demi-pesée → calcul automatique pesée totale et ratio kg/cadre
- Curseur nb cadres avec repères visuels : traits + numérotation **4 | 6 | 8 | 10**
- Clavier numérique (`inputmode="decimal"`)
- **Historique** : 50 pesées par défaut, bouton "Afficher N de plus" (par tranches de 50)
- **Modification** via bottom sheet (✏️), **suppression** avec confirmation

### Production (Hausses)
- Compteurs en haut : Récolté année + Miel en cours
- Pose : référence, ruche, date, poids de référence pré-rempli
- Retrait :
  - Calcul automatique du miel récolté
  - Champ **Produit** : Toutes fleurs, Châtaignier, Bonbons, Hydromel
  - **N° de lot** auto-généré `YY-P-##` (P = M/H/B selon produit), séquentiel global annuel, mis à jour en temps réel au changement de produit ou de date
- Historique poses + retraits

### Nourrissement / Traitements / Actions / Varroa / Frelons
- Multi-ruches, types configurables
- Compteur traitements corrigé (filtre sur `semaine`)

### Achats
- Facture PDF : upload à la création ou a posteriori
- Modification et suppression via bottom sheet

### Dashboard
- Toutes les tuiles de stats sont cliquables → dropdown détail :
  - **Ruches** : liste ID — Nom
  - **Colonies** : Nom colonie | ID ruche
  - **Hausses** : ref · ruche · jours en place
  - **En stock** : par produit
  - **Traitements** : par type
- Bloc **Hausses en production** : miel estimé par hausse, lien vers Production

### Alertes au démarrage
- Cadre à mâles > 14j, remérage > 14j, pose de hausse recommandée
- "Ne plus afficher" sauvegardé immédiatement au cochage
- Purge snooze uniquement si données chargées (évite effacement sur cache vide)

### Splash screen
- Logo hexagone SVG avec relief (gradient lumière/ombre, bordure dégradée, doubles contours)
- Statistiques temps réel : ruches, hausses, récolté année, miel en cours
- Thème clair/sombre appliqué dès l'ouverture

### Interface générale
- **Thème clair "Miel & Lin"** et thème sombre — bascule dans Paramétrage → Apparence
- **Menu** : 3 colonnes mobile / 6 desktop, tuiles 72px, icônes SVG `currentColor`
- **Nav bar** : icônes SVG cohérentes
- Titres de sections menu en doré gras

---

## Numérotation des lots de récolte

Format : `YY-P-##`

| Composant | Valeur |
|---|---|
| `YY` | Année sur 2 chiffres |
| `P` | M = miel (Toutes fleurs, Châtaignier), H = hydromel, B = bonbons |
| `##` | Séquentiel global annuel (nb hausses retirées avec num_lot dans l'année + 1) |

---

## Calcul du miel estimé

```
miel_estimé = dernière_pesée_ruche_depuis_pose
            − poids_ref_hausse
            − Σ(poids_miel des autres hausses retirées depuis la date_pose)
```

Appliqué à 4 endroits : dashboard, liste hausses actives, fiche ruche, formulaire de retrait.

---

## Alertes — logique snooze

Clés : `localStorage['ruches_alertes_snooze']` → tableau `"nom_ruche|type_alerte"`.
Purge uniquement si `DB.ruches.length > 0`.

---

## Déploiement

```bash
git clone https://github.com/Robeenwind007/apiruche.git
git add index.html
git commit -m "v2.6.0"
git push origin main
```

---

## Versioning

| Version | Date | Changements principaux |
|---|---|---|
| 2.6.0 | Mars 2026 | Icônes SVG menu + nav, thème clair/sombre, historique pesées 50+ avec pagination, édition pesées, curseur cadres avec repères, dashboard dropdowns détail, bloc hausses production dashboard, colonies pastille reine inline + ordre inversé, n° de lot récolte YY-P-##, champ Produit (ex-Variété), couleur jaune reine #e6db0c, correction compteur traitements |
| 2.5.0 | Mars 2026 | Factures PDF achats, édition/suppression achats, badges hausses liste ruches, stats splash, logo hexagonal relief, compteurs production |
| 2.4.x | Mars 2026 | Hausses et production miel, paramétrage complet, WhatsApp alertes, fiche apiculteur |
| 2.0.x | Fév. 2026 | Migration Supabase, colonies, dashboard, historique |
| 1.x | Jan. 2026 | Version initiale localStorage |

---

*ApiRuche — Principauté de Cordemais — usage personnel*
