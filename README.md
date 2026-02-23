# IIBS Absence Front

Frontend Angular de la plateforme IIBS Absence.

## Objectif
Application web pour:
- authentification (`login/register`)
- gestion académique (classes, professeurs, étudiants, cours)
- gestion des absences et justifications
- tableau de bord statistiques

## Stack
- Angular 21 (standalone components)
- Angular Material
- RxJS
- TypeScript

## Prérequis
- Node.js 20+
- npm 10+

## Installation
```bash
npm install
```

## Lancement en développement
```bash
npm start
```

Application disponible sur `http://localhost:4200`.

## Configuration API
Fichiers:
- `src/environments/environment.ts` (dev)
- `src/environments/environment.prod.ts` (prod)

Variable principale:
- `apiUrl`

Exemple local:
```ts
apiUrl: 'http://localhost:3000/api'
```

## Scripts utiles
```bash
npm start          # ng serve
npm run build      # build production
npm run build:vercel
npm run watch      # build watch (dev)
npm test
```

## Architecture actuelle
```text
src/app/
├── application/
│   └── facades/              # couche application (orchestration UI -> services)
├── core/
│   ├── guards/
│   ├── interfaces/
│   ├── interceptors/
│   ├── models/
│   └── services/             # accès API
├── features/                 # pages métier
└── shared/components/        # composants réutilisables
```

### Points clés d'architecture
- séparation `services` (infrastructure HTTP) / `facades` (usage UI)
- composants partagés pour réduire la duplication:
  - `shared/components/page-header/page-header.ts`
  - `shared/components/empty-state/empty-state.ts`
- routes en lazy loading pour réduire le bundle initial
- typage API via `ApiResponse<T>`

## Routing
Fichier: `src/app/app.routes.ts`

- routes publiques: `login`, `register`
- routes protégées via `authGuard`
- chargement lazy des pages

## Authentification
- token JWT stocké via `TokenService`
- injection du token via `authInterceptor`
- rôles gérés côté UI:
  - `RP`
  - `PROF`
  - `ATTACHE`
  - `ETUDIANT`

## Build production
```bash
npm run build
```

Sortie:
- `dist/iibs-absence-front/browser`

## Docker
Fichiers:
- `Dockerfile`
- `nginx.conf`

Build et run:
```bash
docker build -t iibs-absence-front .
docker run -p 8080:80 iibs-absence-front
```

Application: `http://localhost:8080`

## Déploiement Vercel
Fichier: `vercel.json`

Commandes:
```bash
npm ci
npm run build:vercel
```

Sur Vercel:
1. définir la racine du projet sur `iibS-absence-front`
2. garder les settings détectés (`vercel.json`)
3. déployer

## Performance
- lazy loading activé
- preloading des routes lazy activé (`PreloadAllModules`)
- optimisation de rendu sur plusieurs écrans (suppression de duplications `async`, composants partagés)

## Troubleshooting

### Erreur CORS / API inaccessible
- vérifier `environment.ts` et `environment.prod.ts`
- vérifier que le backend tourne sur le bon port

### Erreur 401/403
- vérifier que le token JWT est présent/valide
- vérifier le rôle utilisateur

### Build échoue sur fonts Google
- l'inlining des fonts est désactivé en production (`angular.json`)

## Références
- README racine: `../README.md`
- backend: `../iibS-absence-back/README.md`
