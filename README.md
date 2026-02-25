# IIBS Absence Front

Frontend Angular de la plateforme IIBS Absence.

## Stack
- Angular 21 (standalone)
- Angular Material
- RxJS
- TypeScript

## Scripts
```bash
npm start
npm run build
npm run build:vercel
npm run watch
npm test
npm run test:unit
```

## Configuration API
Les services utilisent `environment.prod.ts`.

Fichier:
- `src/environments/environment.prod.ts`

Variable:
```ts
apiUrl: 'https://.../api' // ou http://localhost:3000/api
```

## Architecture
```text
src/app/
├── application/facades/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   ├── interfaces/
│   └── services/
├── features/
└── shared/components/
```

## Routes principales
- `/login`
- `/register`
- `/dashboard`
- `/classes`
- `/classes/etudiants` (classe + année académique => étudiants inscrits)
- `/professeurs`
- `/etudiants`
- `/cours/planifier`
- `/mes-cours`
- `/absences/enregistrer`
- `/absences/traiter-justifications`
- `/mes-absences`
- `/mes-justifications`
- `/stats`

## Points fonctionnels livrés
- Cours d'un professeur limités à ses cours dans l'écran d'absence.
- Classes limitées à celles du cours sélectionné.
- État d'absence étudiant: non justifiée / en attente / refusée / justifiée.
- Stats affichées avec nom/prénom (Top 5, >25h) avec fallback matricule.
- Page dédiée: étudiants inscrits par classe et année académique.

## Tests
### Unit
`test:unit` couvre les utilitaires stats:
- `src/app/features/stats/stats.utils.spec.ts`

### Build
```bash
npm run build
```

## Déploiement
### Vercel
- connecter le repo front
- vérifier `apiUrl` côté prod
- push sur `main` => auto-deploy
