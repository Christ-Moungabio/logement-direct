# Logement Direct

Plateforme d'annonces de logements à louer sans intermédiaire payant. Les propriétaires publient directement leurs biens, les chercheurs de logement les trouvent, les filtrent et réservent une visite.

Projet réalisé dans le cadre de l'Évaluation 2 (Sprint Produit en Squad) d'Akieni Academy.

## Fonctionnalités

**Locataire**
- Inscription et connexion
- Recherche par ville, filtres par prix, type de bien et quartier
- Consultation des annonces et contact du propriétaire (WhatsApp ou appel)
- Réservation d'une visite sur un créneau disponible
- Avis sur le logement après la visite

**Propriétaire**
- Publication et gestion des annonces (photos, prix, localisation, type de bien)
- Définition des créneaux de visite
- Confirmation ou refus des demandes de visite
- Fermeture d'une annonce une fois le bien loué

**Admin**
- Validation des annonces avant publication
- Gestion des utilisateurs, des annonces et des catégories
- Traitement des signalements et arbitrage des avis contestés

La réservation finale et la caution se font en dehors de la plateforme. Les paiements en ligne et les agences sont prévus pour une version ultérieure.

## Stack technique

- Framework : Next.js
- Base de données : à renseigner une fois le choix validé par l'équipe
- Déploiement : à renseigner

## Prérequis

- Node.js (version LTS récente)
- npm
- Git

## Installation

```bash
git clone https://github.com/VOTRE-PSEUDO/logement-direct.git
cd logement-direct
npm install
```

Copier le fichier d'exemple des variables d'environnement, puis renseigner les valeurs :

```bash
cp .env.example .env.local
```

Lancer le projet en local :

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Construit l'application pour la production |
| `npm run start` | Lance l'application construite |
| `npm run lint` | Vérifie la qualité du code |

## Organisation du dépôt

- `main` : branche stable, utilisée pour la démonstration. Aucun push direct.
- `dev` : branche d'intégration. Toutes les fonctionnalités y arrivent par Pull Request.
- `docs/` : documents du Product Package (SPEC, FRD, User Stories, schéma de base de données).

Les règles de travail (branches, commits, Pull Requests) sont décrites dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Équipe

| Rôle | Membres |
|---|---|
| Product Manager | |
| Business Analyst | |
| Développeurs | |
| Digital Marketers | |