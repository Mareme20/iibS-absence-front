// dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionFacade } from '../../application/facades/session.facade';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <ng-container *ngIf="user$ | async as user">
    <div class="dashboard-container">
      <h1>Bienvenue, {{ user.prenom }}!</h1>
      <p class="role-badge">Rôle: {{ user.role }}</p>

      <div class="dashboard-grid">
        <!-- Menu RP -->
        <ng-container *ngIf="user.role === 'RP'">
          <mat-card class="dashboard-card" routerLink="/classes">
            <mat-icon>class</mat-icon>
            <h3>Gestion des Classes</h3>
            <p>Gérer les classes et filières</p>
          </mat-card>
          
          <mat-card class="dashboard-card" routerLink="/professeurs">
            <mat-icon>person_tie</mat-icon>
            <h3>Gestion des Professeurs</h3>
            <p>Créer et gérer les professeurs</p>
          </mat-card>
          
          <mat-card class="dashboard-card" routerLink="/cours/planifier">
            <mat-icon>event_note</mat-icon>
            <h3>Planifier un Cours</h3>
            <p>Créer un nouveau cours</p>
          </mat-card>
          
          <mat-card class="dashboard-card" routerLink="/stats">
            <mat-icon>bar_chart</mat-icon>
            <h3>Statistiques</h3>
            <p>Voir les statistiques détaillées</p>
          </mat-card>
        </ng-container>

        <!-- Menu ATTACHE -->
        <ng-container *ngIf="user.role === 'ATTACHE'">
          <mat-card class="dashboard-card" routerLink="/etudiants">
            <mat-icon>school</mat-icon>
            <h3>Gestion des Étudiants</h3>
            <p>Inscrire et gérer les étudiants</p>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/absences/traiter-justifications">
            <mat-icon>task_alt</mat-icon>
            <h3>Traiter Justifications</h3>
            <p>Valider ou rejeter les justificatifs</p>
          </mat-card>
          
          <mat-card class="dashboard-card" routerLink="/stats">
            <mat-icon>bar_chart</mat-icon>
            <h3>Statistiques</h3>
            <p>Voir les statistiques</p>
          </mat-card>
        </ng-container>

        <!-- Menu PROF -->
        <ng-container *ngIf="user.role === 'PROF'">
          <mat-card class="dashboard-card" routerLink="/absences/enregistrer">
            <mat-icon>fact_check</mat-icon>
            <h3>Enregistrer Absence</h3>
            <p>Marquer les absences</p>
          </mat-card>

           
          
          <mat-card class="dashboard-card" routerLink="/mes-cours">
            <mat-icon>menu_book</mat-icon>
            <h3>Mes Cours</h3>
            <p>Voir mes cours</p>
          </mat-card>
        </ng-container>

        <!-- Menu ETUDIANT -->
        <ng-container *ngIf="user.role === 'ETUDIANT'">
          <mat-card class="dashboard-card" routerLink="/mes-absences">
            <mat-icon>fact_check</mat-icon>
            <h3>Mes Absences</h3>
            <p>Voir mes absences</p>
          </mat-card>
          
          <mat-card class="dashboard-card" routerLink="/mes-justifications">
            <mat-icon>assignment</mat-icon>
            <h3>Mes Justificatifs</h3>
            <p>Gérer mes justificatifs</p>
          </mat-card>
        </ng-container>
      </div>
    </div>
    </ng-container>
  `,
  styles: [`
    .dashboard-container { padding: 22px 14px 10px; }
    .dashboard-container h1 {
      margin: 2px 0 6px;
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      color: #1f2d34;
      font-weight: 700;
    }
    .role-badge {
      display: inline-block;
      background: linear-gradient(120deg, #116d62, #1f8c7f);
      color: #f8fffd;
      padding: 5px 14px;
      border-radius: 999px;
      margin-bottom: 22px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 18px;
    }
    .dashboard-card {
      padding: 24px 18px;
      cursor: pointer;
      border-radius: 18px;
      border: 1px solid rgba(20, 38, 44, 0.1);
      transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
      text-align: center;
      box-shadow: 0 10px 24px rgba(20, 32, 34, 0.08);
      background: linear-gradient(165deg, rgba(255,255,255,0.94), rgba(255,255,255,0.72));
    }
    .dashboard-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 18px 26px rgba(14, 26, 28, 0.14);
      border-color: rgba(17, 109, 98, 0.45);
    }
    .dashboard-card mat-icon {
      font-size: 46px;
      width: 46px;
      height: 46px;
      color: #127366;
      margin-bottom: 14px;
      transition: transform 0.26s ease;
    }
    .dashboard-card:hover mat-icon { transform: scale(1.08); }
    .dashboard-card h3 {
      margin: 8px 0 6px;
      color: #223039;
      font-size: 1.02rem;
      font-weight: 700;
    }
    .dashboard-card p {
      color: #51636c;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.36;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private sessionFacade = inject(SessionFacade);
  user$ = this.sessionFacade.user$;

  ngOnInit() {}
}
