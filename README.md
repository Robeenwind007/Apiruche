# 🐝 Apiruche — Principauté de Cordemais

Application de gestion apicole — fichier HTML unique, Supabase + GitHub Pages.

**URL** : https://robeenwind007.github.io/Apiruche/

---

## Changelog

### v2.4.2 — Mars 2026
- **Stock & Vente** : liste complète des opérations avec boutons ✏️ modifier et 🗑 supprimer
- **Stock & Vente** : calcul du stock regroupé par variété uniquement (entrées et sorties se compensent correctement)
- **Stock & Vente** : chiffre d'affaires de l'année en cours affiché dans l'en-tête du bloc stock
- **Stock & Vente** : quantités affichées en "unités" (neutre pour pots, sachets, bouteilles)
- **Alertes démarrage** : case à cocher "Ne plus afficher" sur chaque alerte — sauvegardée dans localStorage, purge automatique quand la condition se résout
- **Nourrir / Soigner / Actions** : cartes ruches affichent désormais le nom de la ruche (et non le nom de la colonie), avec nom en haut et numéro en dessous
- **Supabase** : colonne `type_pot` de la table `conditionnements` convertie de ENUM en TEXT (via drop/recreate vue `stock_miel`)

### v2.4.1 — Mars 2026
- Correctifs divers et ajustements interface

### v2.4.0 — Mars 2026
- Workflow GitHub Actions alertes WhatsApp (Node.js 24, cron 11h UTC)
- Correction bug CRON : calcul poids depuis `demi_pesee` quand `pesee` est null
- Script `cron-alertes.js` à la racine du repo

### v2.3.x et antérieures
- Mise en place Stock & Vente (conditionnements)
- Alertes banner au démarrage (cadre à mâles, remérage, hausse à poser)
- Journal des actions (logs localStorage)
- Écrans : Ruches, Colonies, Hausses, Pesée, Nourrir, Soigner, Actions, Varroa, Frelons, Achats, Production, Réglages

---

## Stack technique

| Composant | Détail |
|-----------|--------|
| Frontend | HTML/CSS/JS — fichier unique `index.html` |
| Backend | Supabase (PostgreSQL + REST API) |
| Hébergement | GitHub Pages |
| Alertes | GitHub Actions CRON + WhatsApp Callmebot |
| Polices | DM Serif Display · Inter · Cinzel |

## Configuration

Au premier lancement, renseigner dans **Réglages → Supabase** :
- URL du projet Supabase
- Clé `anon` Supabase

Pour les alertes WhatsApp, renseigner dans **Réglages → WhatsApp** :
- Numéro de téléphone
- Clé API Callmebot

Les secrets GitHub Actions (`SUPABASE_URL`, `SUPABASE_KEY`, `WA_PHONE`, `WA_APIKEY`) sont à configurer dans Settings → Secrets du repo.
