# Ndako

Plateforme d'annonces de logements à louer à Brazzaville, sans intermédiaire payant. Les propriétaires publient directement leurs biens, les chercheurs de logement les trouvent selon leur budget, leur quartier et leurs besoins, puis contactent le propriétaire par WhatsApp ou par appel.

Projet réalisé dans le cadre de l'Évaluation 2 (Sprint Produit en Squad) d'Akieni Academy.

**Démo en ligne :** _à renseigner après le premier déploiement_

---

## Sommaire

- [Le problème](#le-problème)
- [Fonctionnalités](#fonctionnalités)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Scripts disponibles](#scripts-disponibles)
- [Déploiement](#déploiement)
- [Organisation du dépôt](#organisation-du-dépôt)
- [Documentation](#documentation)
- [Équipe](#équipe)

---

## Le problème

À Brazzaville, trouver un logement à louer est long et coûteux : offres dispersées, visites décevantes, maisons différentes de leur description, et dépendance aux démarcheurs, qui réclament souvent un mois de loyer supplémentaire. Ndako centralise les offres, affiche les informations essentielles (loyer, avance, eau, électricité, disponibilité) et met le locataire en relation directe avec le propriétaire.

La réservation finale du logement et le paiement de la caution se font directement avec le propriétaire, **en dehors de la plateforme**.

---

## Fonctionnalités

Les priorités suivent la méthode MoSCoW : **Must** (indispensable au MVP), **Should** (prévu si la capacité le permet), **Could** (confort). La colonne État est mise à jour au fil du sprint.

### Visiteur et locataire

| Fonctionnalité | Priorité | État |
|---|---|---|
| Recherche depuis l'accueil par ville, type de bien et budget, sans connexion | Must | À faire |
| Filtres par quartiers, types de bien et loyer ; tri par date ou par prix ; pagination | Must | À faire |
| Fiche annonce : photos, loyer, avance, eau, électricité, nombre de portes, disponibilité, date de mise à jour | Must | Fait, en revue |
| Inscription et connexion par e-mail et mot de passe (numéro WhatsApp obligatoire) | Must | Fait |
| Contact du propriétaire par WhatsApp ou appel, réservé aux utilisateurs connectés | Must | Fait, en revue |
| Signalement d'une annonce avec un motif | Must | Fait, en revue |
| Demande de visite sur un créneau disponible, suivi dans « Mes visites » | Should | À faire |
| Avis sur le logement (note de 1 à 5 et commentaire) après une visite effectuée | Should | À faire |
| Notifications dans l'application | Should | À faire |

### Propriétaire

| Fonctionnalité | Priorité | État |
|---|---|---|
| Création d'une annonce en brouillon avec 1 à 8 photos et aperçu | Must | À faire |
| Publication directe, sans validation : l'annonce est visible des locataires 5 minutes après le clic sur Publier | Must | À faire |
| Page « Mes annonces » avec statuts, filtres et actions | Must | À faire |
| Modification d'une annonce et mise à jour de la disponibilité (Libre / Bientôt libre), effet immédiat | Must | À faire |
| Fermeture d'une annonce avec un motif (Loué / Retirée) | Must | À faire |
| Définition de créneaux de visite de 30 minutes, confirmation ou refus des demandes | Should | À faire |
| Contestation d'un avis | Should | À faire |

### Administrateur

| Fonctionnalité | Priorité | État |
|---|---|---|
| Traitement des signalements (Traité / Rejeté) avec historique | Must | À faire |
| Masquage ou réaffichage d'une annonce avec un motif obligatoire (modération a posteriori) | Must | À faire |
| Gestion des utilisateurs : recherche, suspension, réactivation | Should | À faire |
| Arbitrage des avis contestés | Should | À faire |
| Statistiques simples | Should | À faire |
| Gestion des listes de villes, quartiers et types de bien | Could | À faire |

Il n'y a **pas de validation préalable** des annonces : la fiabilité repose sur la date de mise à jour visible, le signalement par les utilisateurs et la modération par l'administrateur.

### Hors MVP (version ultérieure)

Agences et démarcheurs, paiement en ligne et Mobile Money, réservation finale du logement, notifications SMS et e-mail, carte, favoris.

---

## Comptes de démonstration

Ces comptes sont créés par le script de seed (voir [Base de données](#base-de-données)). On se connecte sur `/connexion` avec l'adresse e-mail et le mot de passe.

| Rôle | E-mail | Mot de passe | Numéro WhatsApp |
|---|---|---|---|
| Locataire | `locataire@ndako.cg` | `Demo-Locataire-2026` | +242 06 000 00 01 |
| Propriétaire | `proprietaire@ndako.cg` | `Demo-Proprio-2026` | +242 06 000 00 02 |
| Administrateur | `admin@ndako.cg` | `Demo-Admin-2026` | +242 06 000 00 03 |

Le compte administrateur ne peut pas être créé depuis l'inscription publique.

Le seed crée aussi sept annonces du propriétaire de démonstration, qui couvrent les cas de la fiche annonce : annonce complète (8 photos, nombre de portes), une seule photo sans nombre de portes, « Bientôt libre », une annonce à Pointe-Noire, un brouillon, une annonce fermée et une annonce masquée. Les liens sont affichés à la fin de `npm run db:seed`. Les photos sont des images générées, sans droits.

---

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework (frontend et backend) | Next.js 16 (App Router), JavaScript |
| Base de données | PostgreSQL hébergé sur Supabase, sécurisé par la Row Level Security (RLS) |
| Accès aux données | `@supabase/ssr` et `@supabase/supabase-js`, côté serveur |
| Authentification | Supabase Auth (e-mail et mot de passe) |
| Stockage des photos | Supabase Storage (bucket public `listing-photos`) |
| Tâches planifiées | `pg_cron` (mise en ligne après 5 minutes, passage à « Libre ») |
| Validation des données | Zod |
| Interface | CSS Modules, design system dans `app/globals.css`, icônes Lucide |
| Qualité du code | ESLint |
| Déploiement | Vercel (prévu) |

---

## Architecture

L'application est un projet Next.js **fullstack** : il n'y a pas de backend séparé. Les pages sont des Server Components qui lisent les données, et les modifications passent par des Server Actions. Toutes les requêtes passent par un client Supabase créé **côté serveur avec la session de l'utilisateur** : la sécurité repose sur les politiques RLS et les fonctions SQL de la base, qui s'appuient sur `auth.uid()`. Le navigateur n'appelle jamais Supabase directement.

```
app/                      # Routage (pages, layouts) et design system (globals.css)
├── (auth)/               # Connexion, inscription
├── annonces/[id]/        # Fiche annonce
└── conditions/, confidentialite/
components/               # Header, Footer, ListingCard, ui/Button…
lib/                      # constants.js, format.js (FCFA, dates), whatsapp.js
proxy.js                  # Session Supabase et routes protégées
src/
├── features/             # Une fonctionnalité = un dossier
│   ├── annonces/         # Fiche annonce (module FIC)
│   └── auth/             # Inscription, connexion, getCurrentProfile, requireUser
└── lib/supabase/         # Clients Supabase et types générés
supabase/migrations/      # Schéma de la base (SQL)
scripts/                  # Seed et génération des types
```

Les autres modules (recherche, propriétaire, locataire, administration) viendront s'ajouter dans `app/` et `src/features/` selon la même organisation.

Chaque dossier de `src/features/` contient ses requêtes de lecture (`queries.js`), ses Server Actions (`actions.js`), ses schémas de validation (`schemas.js`) et ses composants, chacun avec son CSS Module.

Quelques principes qui guident le code :

- **Les droits sont vérifiés côté serveur** : chaque Server Action vérifie l'utilisateur avec `getCurrentProfile()`, et la RLS refuse de toute façon ce qui n'est pas autorisé.
- **Le numéro du propriétaire n'est jamais envoyé au navigateur** d'un visiteur non connecté : il n'est lu, via la fonction `get_listing_contact`, que pour un utilisateur connecté.
- **La clé secrète Supabase** contourne la RLS : elle n'est utilisée que par l'inscription (`src/lib/supabase/admin.js`) et par le script de seed.
- **Les statuts liés au temps** sont gérés par la base : une tâche `pg_cron` publie chaque minute les annonces dont le délai de 5 minutes est écoulé et passe en « Libre » celles dont la date est atteinte. La vue `public_listings` filtre aussi sur la date de mise en ligne, et la fiche affiche « Libre » dès la date atteinte, même si la tâche a du retard.
- **Interface mobile d'abord**, utilisable dès 360 px de large, en français, montants au format `150 000 FCFA`, fuseau horaire de Brazzaville.

---

## Authentification

- Connexion par **e-mail et mot de passe** (Supabase Auth). L'activation du téléphone dans Supabase exige un fournisseur SMS payant (Twilio, Vonage…), l'équipe a donc choisi l'e-mail.
- Le **numéro WhatsApp reste obligatoire** à l'inscription. Il est enregistré dans `profiles.whatsapp_number` (format `+242` suivi de 9 chiffres, un numéro par compte) et sert au contact avec les propriétaires.
- Aucune confirmation par e-mail : le compte est créé côté serveur, déjà confirmé, et l'utilisateur est connecté tout de suite.
- `proxy.js` rafraîchit la session à chaque requête (`src/lib/supabase/proxy.js`).
- Les trois clients Supabase sont dans `src/lib/supabase/` : `server.js` (Server Components et Server Actions), `client.js` (navigateur), `admin.js` (serveur uniquement, clé secrète, contourne la RLS).

## Prérequis

- Node.js 22 (LTS) ou supérieur
- npm 10 ou supérieur
- Git
- Un projet Supabase (l'offre gratuite suffit)
- Docker, uniquement pour régénérer les types de la base (`npm run db:types`)

---

## Installation

```bash
git clone git@github.com:Christ-Moungabio/logement-direct.git
cd logement-direct
npm install
```

Copier le fichier d'exemple des variables d'environnement, puis renseigner les valeurs (voir la section suivante). Les scripts lisent `.env.local`, ou `.env` à défaut :

```bash
cp .env.example .env.local
```

Créer les tables : sur un projet Supabase vierge, appliquer le fichier `supabase/migrations/20261002090000_schema_initial.sql`, soit en le collant dans le SQL Editor de Supabase, soit avec la CLI :

```bash
npx supabase db push --db-url "<DATABASE_URL>"
```

Charger les données de démonstration :

```bash
npm run db:seed
```

Lancer le projet en local :

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000.

---

## Variables d'environnement

| Variable | Description | Où l'obtenir |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Supabase : Project Settings, API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publique (`sb_publishable_…`), utilisée avec la session de l'utilisateur | Supabase : Project Settings, API Keys |
| `SUPABASE_SECRET_KEY` | Clé secrète (`sb_secret_…`), utilisée côté serveur par l'inscription et par le script de seed | Supabase : Project Settings, API Keys |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL, pour appliquer la migration et générer les types | Supabase : Connect, Session pooler ou connexion directe (port 5432) |
| `NEXT_PUBLIC_SITE_URL` | Facultatif : URL publique du site, utilisée dans les messages WhatsApp. À défaut, l'hôte de la requête est utilisé | URL de production |

Les fichiers `.env` et `.env.local` ne doivent **jamais** être commités. La clé `SUPABASE_SECRET_KEY` contourne la RLS et donne un accès complet au projet : elle ne doit être utilisée que côté serveur (`src/lib/supabase/admin.js`, protégé par `server-only`) et ne doit jamais porter le préfixe `NEXT_PUBLIC_`.

---

## Base de données

Le schéma est défini en SQL dans `supabase/migrations/20261002090000_schema_initial.sql` : tables, vue publique `public_listings`, fonction `get_listing_contact`, politiques RLS, bucket des photos et tâche `pg_cron`. Une migration déjà appliquée ne doit pas être modifiée : toute évolution passe par un **nouveau** fichier dans `supabase/migrations/`, validé par l'équipe.

Après une évolution du schéma, régénérer les types (Docker doit être lancé) :

```bash
npm run db:types
```

Le script de seed crée les trois comptes de démonstration, ajoute Pointe-Noire et ses quartiers (Brazzaville est créée par la migration), puis sept annonces avec leurs photos, dont quatre en ligne. Il est rejouable : il ne supprime que les annonces, photos et signalements des comptes de démonstration. Les identifiants des annonces changent à chaque exécution.

```bash
npm run db:seed
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Construit l'application pour la production |
| `npm run start` | Lance l'application construite |
| `npm run lint` | Vérifie la qualité du code |
| `npm run db:types` | Génère les types de la base dans `src/lib/supabase/database.types.ts` (Docker requis) |
| `npm run db:seed` | Charge les données de démonstration (rejouable) |

---

## Déploiement

Le déploiement est prévu sur Vercel à partir de la branche `main`. Les variables d'environnement listées plus haut doivent être renseignées dans les paramètres du projet Vercel, avec `NEXT_PUBLIC_SITE_URL` pointant vers l'URL de production. `SUPABASE_SECRET_KEY` est nécessaire en production pour l'inscription.

Sur l'offre gratuite, un projet Supabase inactif pendant plusieurs jours est mis en pause automatiquement. Vérifier qu'il est actif avant chaque démonstration.

---

## Organisation du dépôt

- `main` : branche stable, utilisée pour la démonstration. Aucun push direct.
- `dev` : branche d'intégration. Toutes les fonctionnalités y arrivent par Pull Request.
- `feature/<nom>` : une branche par fonctionnalité, par exemple `feature/fic-fiche-annonce`.

Les messages de commit suivent la forme `feat: …`, `fix: …`, `chore: …`.

_À compléter : le fichier `CONTRIBUTING.md` et le dossier `docs/` ne sont pas encore dans le dépôt._

---

## Documentation

| Document | Contenu |
|---|---|
| `docs/SPEC_Specification_Fonctionnelle.pdf` | Cadrage, acteurs, parcours, règles de gestion, données, exigences non fonctionnelles |
| `docs/FRD_Exigences_Fonctionnelles.pdf` | Exigences fonctionnelles par module, avec priorités MoSCoW |
| `supabase/migrations/` | Schéma de la base de données |

_Les documents du Product Package (SPEC, FRD, User Stories, maquettes) sont à ajouter dans `docs/`._

---

## Équipe

| Rôle | Membres |
|---|---|
| Product Manager | |
| Business Analyst | |
| Développeurs | |
| Digital Marketers | |