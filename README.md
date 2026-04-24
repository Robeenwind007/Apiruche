# 🐝 Apiruche — Principauté de Cordemais

Application de gestion apicole — fichier HTML unique, Supabase + GitHub Pages.

**URL** : https://robeenwind007.github.io/Apiruche/

---

## Changelog

### v2.7.8 — Avril 2026
- **Production** : tuile gauche remplacée par le nombre de hausses en place (au lieu de "Récolté 0 kg")
- **Production** : hausses triées de la plus ancienne à la plus récente
- **Production** : barre de progression 0→15 kg par hausse avec repères à 9 kg (orange) et 12 kg (vert)
- **Production** : hausses regroupées par ruche avec en-tête (ruche + colonie + nb hausses)
- **Récolte Année N** : section "Récoltes par ruche" affiche uniquement les hausses récoltées (historique)
- **Récolte Année N** : chaque hausse récoltée affiche date, variété, numéro de lot et colonie au moment de la récolte
- **Récolte Année N** : bloc export PDF toujours visible dès qu'une hausse est récoltée
- **Numéro de lot** : les hausses récoltées le même jour partagent automatiquement le même numéro de lot

### v2.7.x — Avril 2026
- **Production** : nouveau groupement par ruche
- **Récolte** : séparation nette Production (actif) / Récolte (historique)
- **Export PDF** : déplacé de Production vers Récolte Année N
- **Tableau de bord** : tuiles Achats / Ventes / Balance pour l'année en cours
- **Alertes splash** : badges oranges (hausses à doubler ≥9 kg) et verts (hausses à récolter ≥12 kg)
- **CRON WhatsApp** : alertes hausses à récolter et à doubler ajoutées
- **Stock & Vente** : liste des opérations avec modifier/supprimer, CA annuel, regroupement par variété
- **Nourrir / Soigner / Actions** : cartes ruches avec nom en haut, numéro en dessous
- **Nouvelle colonie** : select des ruches libres uniquement
- **Déplacement colonie** : transfert automatique des actions en cours (cadre à mâles, remérage) vers la nouvelle ruche
- **Version visible** : numéro de version affiché en bas de la nav bar

### v2.5.x — Mars 2026
- Alertes démarrage : case à cocher "Ne plus afficher" avec purge automatique
- Bug calcul stock : regroupement par variété uniquement
- Correction ENUM `type_pot` → TEXT dans Supabase
- Correction sélecteur ruches Nourrir/Soigner : nom de la ruche au lieu du nom de colonie

### v2.4.x — Mars 2026
- Workflow GitHub Actions alertes WhatsApp (Node.js 24, cron 11h UTC)
- Correction bug CRON : calcul poids depuis `demi_pesee` quand `pesee` est null
- Script `cron-alertes.js` à la racine du repo

### v2.3.x et antérieures
- Mise en place Stock & Vente, alertes banner, journal des actions
- Écrans : Ruches, Colonies, Hausses, Pesée, Nourrir, Soigner, Actions, Varroa, Frelons, Achats, Production, Réglages

---

## Architecture

| Composant | Détail |
|-----------|--------|
| Frontend | HTML/CSS/JS — fichier unique `index.html` |
| Backend | Supabase (PostgreSQL + REST API) |
| Hébergement | GitHub Pages |
| Alertes | GitHub Actions CRON + WhatsApp Callmebot |
| Polices | DM Serif Display · Inter · Cinzel |

## Logique Production / Récolte

| Écran | Contenu |
|-------|---------|
| **Production** | Hausses **en cours** uniquement — pose, suivi, retrait |
| **Récolte Année N** | Hausses **récoltées** uniquement — historique, poids réels, export PDF |

Les hausses en cours disparaissent de Production une fois récoltées et apparaissent dans Récolte.

## Numéro de lot

Le numéro de lot est généré automatiquement au format `AA-M-XX` (ex: `26-M-03`).
Toutes les hausses récoltées **le même jour** partagent automatiquement le même numéro de lot.

## Seuils hausses

| Poids estimé | Couleur | Action |
|---|---|---|
| < 9 kg | 🟡 Doré | Normal |
| ≥ 9 kg | 🟠 Orange | Poser une hausse supplémentaire |
| ≥ 12 kg | 🟢 Vert | Récolter |

## Configuration

Au premier lancement, renseigner dans **Réglages → Supabase** :
- URL du projet Supabase
- Clé `anon` Supabase

Pour les alertes WhatsApp, renseigner dans **Réglages → WhatsApp** :
- Numéro de téléphone
- Clé API Callmebot

Les secrets GitHub Actions (`SUPABASE_URL`, `SUPABASE_KEY`, `WA_PHONE`, `WA_APIKEY`) sont à configurer dans Settings → Secrets du repo.

## Fichiers du repo

| Fichier | Rôle |
|---------|------|
| `index.html` | Application complète |
| `cron-alertes.js` | Script CRON alertes WhatsApp |
| `.github/workflows/alertes-whatsapp.yml` | Workflow GitHub Actions |
| `README.md` | Ce fichier |
