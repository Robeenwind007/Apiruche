# 🐝 Apiruche — Principauté de Cordemais

Application de gestion de ruches et colonies d'abeilles pour Olivier Bernard.  
URL : **https://robeenwind007.github.io/Apiruche/**

---

## Version actuelle : v2.4.0

---

## Changelog

### v2.4.0 — 2026-03-11
- 🔢 Mise à jour du numéro de version affiché sur la page d'accueil (splash screen)
- ✅ Workflow GitHub Actions mis à jour vers Node.js 24 (fin de l'avertissement de dépréciation)
- 🛠️ Consolidation et stabilisation des fonctionnalités v2.3.0

### v2.3.0
- 📋 Journal des actions : vue dédiée, filtres, stats CREATE/UPDATE/DELETE, export CSV
- 🍯 Badge "Poser hausse ?" animé dans la liste des ruches (poids ≥ 32 kg, cadres ≥ 8)
- 💬 Module WhatsApp Callmebot : configuration dans Réglages, test, notification au démarrage
- ⏰ CRON GitHub Actions : alertes quotidiennes à 11h UTC via `cron-alertes.js`
- 🗑️ Suppression des lignes d'historique dans la fiche colonie
- 🐛 Corrections diverses

### v2.2.0
- 🍯 Gestion des hausses (pose, retrait, poids miel, variété)
- 📊 Tableau de bord enrichi (miel estimé en hausse, nb hausses actives)
- 🔬 Comptage Varroa amélioré
- 🏆 Production annuelle — vue récapitulative Récolte Année N

### v2.1.0
- 🛒 Stock & Vente (conditionnements, achats)
- 📦 Gestion des pots et variétés de miel
- 🪲 Pièges à frelons

### v2.0.0
- ⚖️ Pesées avec suivi du poids
- 🍽️ Nourrissements
- 💊 Traitements sanitaires
- 🫱 Actions rucher libres

### v1.0.0
- 🐝 Gestion des ruches (R1–R21+)
- 👑 Gestion des colonies
- 🏡 Gestion des ruchers
- ☁️ Synchronisation Supabase
- 📱 Interface mobile-first, thème sombre doré

---

## Structure du projet

```
Apiruche/
├── index.html                          ← Application complète (fichier unique)
├── cron-alertes.js                     ← Script CRON alertes WhatsApp (Node.js 24)
├── README.md                           ← Ce fichier
└── .github/
    └── workflows/
        └── alertes-whatsapp.yml        ← GitHub Actions (11h UTC quotidien)
```

## Stack technique

- **Frontend** : HTML5 / CSS3 / JavaScript vanilla (fichier unique)
- **Base de données** : Supabase (PostgreSQL)
- **Hébergement** : GitHub Pages
- **Automatisation** : GitHub Actions (Node.js 24)
- **Notifications** : WhatsApp via Callmebot API
- **Polices** : DM Serif Display · Inter · Cinzel
