# 🐝 ApiRuche

> Application de gestion apicole — Principauté de Cordemais

[![Version](https://img.shields.io/badge/version-2.0.1-C8A84B?style=flat-square)](https://github.com/Robeenwind007/Apiruche)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2A5A2A?style=flat-square)](https://robeenwind007.github.io/Apiruche/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square)](https://supabase.com)

---

## 📱 Accès

**[https://robeenwind007.github.io/Apiruche/](https://robeenwind007.github.io/Apiruche/)**

Installez l'app sur votre écran d'accueil pour une expérience native :
- **iOS** : bouton Partager → "Sur l'écran d'accueil"
- **Android** : menu Chrome → "Ajouter à l'écran d'accueil"

---

## ✨ Fonctionnalités

### 🏠 Tableau de bord
- Vue synthétique du rucher
- Indicateurs clés (poids, colonies actives, alertes)

### 🐝 Ruches
- Liste avec filtres (actives / toutes)
- Fiche détaillée avec graphique des pesées SVG
- Gestion du cadre à mâles (alerte si > 14 jours)
- Navigation ‹ › entre les fiches
- Photo de ruche

### 👑 Colonies
- Liste avec état des colonies (actives / terminées)
- Fiche avec historique complet
- Clôturer une colonie (date_fin + fermeture occupation)
- Création avec installation directe dans une ruche

### ⚖️ Saisies
- Pesées (slider cadres, ratio kg/cadre colorisé)
- Nourrissements, Traitements, Actions
- Comptages varroa, Pièges frelons

### 🍯 Récoltes & Stock
- Suivi récoltes par année
- Conditionnement et stock miel

### ⚙️ Paramétrage
- Listes déroulantes personnalisables
- Gestion des ruches (créer, activer/désactiver)
- Gestion du rucher (nom, adresse)
- Fiche apiculteur (NAPI, SIRET, contact)
- Export / Import JSON
- Configuration Supabase

---

## 🎨 Design

- Thème sombre doré — `#0a0a06` + `#c8a84b`
- Polices : **DM Serif Display** · **Inter** · **Cinzel**
- Splash screen animé avec son de bourdonnement
- PWA complète (fonctionne hors ligne)

---

## 🏗️ Architecture

```
index.html          ← Fichier unique (HTML + CSS + JS)
```

| Composant | Détail |
|-----------|--------|
| Frontend | HTML5 / CSS3 / JavaScript vanilla ES6+ |
| Base de données | Supabase (PostgreSQL) |
| API | Supabase REST — fetch natif |
| Cache | localStorage (TTL 5 min) |
| Hébergement | GitHub Pages |

---

## 🗄️ Base de données

Tables principales : `ruches` · `colonies` · `occupations` · `pesees` · `nourrissements` · `traitements` · `actions` · `comptages_varroa` · `recoltes` · `conditionnements` · `achats` · `pieges_frelons` · `ruchers` · `fiche_apiculteur`

### Règles métier
- **Colonie active** : `date_fin IS NULL`
- **Ruche occupée** : présence dans `occupation_courante` (vue Supabase)
- **Ratio kg/cadre** : 🔴 < 2,8 · 🟠 2,8–3,0 · 🟢 ≥ 3,0

---

## 🚀 Déploiement

```bash
# Modifier index.html en local
# Incrémenter APP_VERSION dans le JS
git add index.html
git commit -m "vX.X.X — description"
git push
# GitHub Pages met à jour sous ~2 minutes
```

---

## 📋 Versionning

| Version | Date | Notes |
|---------|------|-------|
| **2.0.1** | Mars 2026 | Splash screen, son, paramétrage complet, listes dynamiques, fond unifié |
| 1.x | 2025 | Architecture initiale localStorage |

---

## 👤 Apiculteur

**Olivier BERNARD** — Rucher Bond, 12 Le Port, 44360 Cordemais  
NAPI : A5079295 · SIRET : 51189491700018

---

*ApiRuche v2.0.1 — 🐝 Principauté de Cordemais*
