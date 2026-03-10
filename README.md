# 🐝 ApiRuche

> Application de gestion apicole — **Principauté de Cordemais**

[![version](https://img.shields.io/badge/version-2.1.0-c8a84b?style=flat-square)](https://robeenwind007.github.io/Apiruche/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?style=flat-square)](https://robeenwind007.github.io/Apiruche/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square)](https://supabase.com)

---

## 📱 Accès

**[https://robeenwind007.github.io/Apiruche/](https://robeenwind007.github.io/Apiruche/)**

Installez l'app sur votre écran d'accueil pour une expérience native :
- **iOS** : bouton Partager → "Sur l'écran d'accueil"
- **Android** : menu Chrome → "Ajouter à l'écran d'accueil"

---

## 🏗 Architecture

| Composant | Technologie |
|-----------|-------------|
| Frontend | HTML + CSS + JS — fichier unique `index.html` |
| Base de données | Supabase (PostgreSQL) |
| Hébergement | GitHub Pages |
| Cache local | `localStorage` (fraîcheur 5 min) |

---

## 🗂 Structure du projet

```
Apiruche/
├── index.html          # Application complète (fichier unique)
└── README.md           # Ce fichier
```

---

## 📦 Modules

### 🏡 Rucher
| Écran | Description |
|-------|-------------|
| **Ruches** | Liste des ruches avec état colonie, poids/cadres, badges alertes |
| **Colonies** | Gestion des colonies, génétique, reine, clôture |
| **Stock & Vente** | Suivi des stocks de miel, conditionnements, ventes |
| **Production** | Suivi des hausses à miel — pose, pesée, retrait/récolte |

### ⚙️ Actions rucher
| Écran | Description |
|-------|-------------|
| **Peser** | Saisie des pesées hebdomadaires avec ratio poids/cadre |
| **Nourrir** | Nourrissements multi-ruches |
| **Soigner** | Traitements anti-varroa multi-ruches |
| **Actions** | Actions diverses sur les ruches (rémérage, division…) |

### 🔬 Suivi & Contrôle
| Écran | Description |
|-------|-------------|
| **Varroa** | Comptages varroa |
| **Frelons** | Suivi des pièges à frelons asiatiques |
| **Achats** | Historique des achats de matériel |

---

## 🍯 Module Production (v2.1.0)

Suivi complet du cycle de la hausse à miel :

1. **Pose de la hausse** → choix ruche (avec colonie liée), référence hausse (H01…H08), poids de référence pré-rempli depuis la dernière pesée
2. **Suivi en temps réel** → miel estimé calculé automatiquement (dernière pesée − poids de référence)
3. **Retrait / Récolte** → poids au retrait, calcul du poids de miel, confirmation
4. **Historique** → total récolté par année + total historique

---

## 🗄 Base de données Supabase

### Tables principales

| Table | Description |
|-------|-------------|
| `ruches` | Ruches du rucher (R1–R21+) |
| `colonies` | Colonies d'abeilles |
| `occupations` | Historique ruche ↔ colonie |
| `occupation_courante` | Vue des occupations actives (date_fin IS NULL) |
| `pesees` | Pesées hebdomadaires |
| `hausses` | Hausses à miel (pose → retrait) |
| `nourrissements` | Nourrissements |
| `traitements` | Traitements anti-varroa |
| `actions` | Actions diverses |
| `recoltes` | Récoltes de miel |
| `conditionnements` | Mise en pots |
| `achats` | Achats de matériel |
| `pieges_frelons` | Pièges à frelons |
| `comptages_varroa` | Comptages varroa |
| `ruchers` | Ruchers (lieux) |
| `fiche_apiculteur` | Informations apiculteur |

### SQL — Création table hausses

```sql
CREATE TABLE IF NOT EXISTS hausses (
  id              TEXT PRIMARY KEY,
  hausse_ref      TEXT NOT NULL,
  ruche_id        TEXT REFERENCES ruches(id),
  colonie_id      TEXT REFERENCES colonies(id),
  date_pose       DATE NOT NULL,
  poids_ref       NUMERIC(6,2),
  date_retrait    DATE,
  poids_retrait   NUMERIC(6,2),
  poids_miel      NUMERIC(6,2),
  variete         TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Design

- **Thème** : sombre noir profond (`#0a0a06`) avec accents dorés (`#c8a84b`)
- **Polices** : DM Serif Display (titres) · Inter (corps) · Cinzel (splash)
- **Indicateurs poids/cadre** :
  - 🔴 Rouge : < 2,8 kg/cadre
  - 🟠 Orange : 2,8–3,0 kg/cadre
  - 🟢 Vert : ≥ 3,0 kg/cadre

---

## ⚙️ Configuration

Au premier lancement, aller dans **Réglages → Supabase** et saisir :
- URL du projet Supabase
- Clé `anon` publique

Les listes (types de traitement, variétés de miel, références hausses…) sont personnalisables dans **Réglages → Listes**.

---

## 👤 Apiculteur

**Olivier BERNARD** — Principauté de Cordemais
NAPI : A5079295 · SIRET : 51189491700018
Cordemais, 44360 Loire-Atlantique

---

## 📋 Changelog

### v2.1.0
- ✨ Module Production : gestion complète des hausses à miel
- ✨ Suivi miel estimé en temps réel
- ✨ Historique récoltes avec totaux annuels
- 🔧 Fusion automatique des nouvelles clés de listes (getListes merge)

### v2.0.1
- ✨ Multi-sélection ruches dans Actions, Traitements, Nourrissements
- ✨ Badges alertes Cadre à mâles et Remérage/Division dans liste ruches
- ✨ Suppression des actions depuis fiche ruche, fiche colonie, écran actions
- 🔧 Picto 🫱 pour les actions rucher

### v2.0.0
- 🚀 Migration AppSheet → app HTML fichier unique
- 🚀 Intégration Supabase PostgreSQL
- 🚀 Thème sombre or/noir, design PWA
