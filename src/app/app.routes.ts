import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/components/main-layout/main-layout').then(m => m.MainLayoutComponent),
     canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'classes', loadComponent: () => import('./features/classes/classes').then(m => m.ClassesComponent) },
      { path: 'professeurs', loadComponent: () => import('./features/professeurs/professeurs').then(m => m.ProfessorsComponent) },
      { path: 'etudiants', loadComponent: () => import('./features/etudiants/etudiants').then(m => m.EtudiantsComponent) },
      { path: 'cours/planifier', loadComponent: () => import('./features/cours/planifier-cours').then(m => m.PlanifierCoursComponent) },
      { path: 'mes-cours', loadComponent: () => import('./features/cours/mes-cours').then(m => m.MesCoursComponent) },
      { path: 'stats', loadComponent: () => import('./features/stats/stats').then(m => m.StatsComponent) },
      { path: 'mes-absences', loadComponent: () => import('./features/absences/mes-absences/mes-absences').then(m => m.MesAbsencesComponent) },
      { path: 'mes-justifications', loadComponent: () => import('./features/absences/mes-justifications/mes-justifications').then(m => m.MesJustificationsComponent) },
      { path: 'absences/enregistrer', loadComponent: () => import('./features/absences/enregistrer-absence/enregistrer-absence').then(m => m.EnregistrerAbsenceComponent) },
      { path: 'absences/traiter-justifications', loadComponent: () => import('./features/absences/traiter-justifications/traiter-justifications').then(m => m.TraiterJustificationsComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
