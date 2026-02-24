// src/app/features/absences/traiter-justifications/traiter-justifications.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JustificationsFacade } from '../../../application/facades/justifications.facade';
import { Justification, StatutJustification } from '../../../core/models/justification.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-traiter-justifications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatSnackBarModule, EmptyStateComponent],
  template: `
    <div class="container">
      <h1>Gestion des Justifications</h1>
      
      <mat-card>
        <mat-card-content>
          <div *ngIf="loading" class="loading">
            <mat-icon>hourglass_empty</mat-icon> Chargement...
          </div>
          
          <app-empty-state *ngIf="!loading && justifications.length === 0" icon="check_circle" message="Aucune justification en attente" color="#4caf50" />

          <table mat-table [dataSource]="justifications" *ngIf="justifications.length > 0" class="full-width">
            <!-- Étudiant Column -->
            <ng-container matColumnDef="etudiant">
              <th mat-header-cell *matHeaderCellDef>Étudiant</th>
              <td mat-cell *matCellDef="let j">
                {{ j.absence?.etudiant?.user?.prenom || j.absence?.etudiant?.prenom }}
                {{ j.absence?.etudiant?.user?.nom || j.absence?.etudiant?.nom }}
                <span *ngIf="!j.absence?.etudiant?.user?.nom && !j.absence?.etudiant?.nom">
                  {{ j.absence?.etudiant?.matricule|| 'N/A' }}
                </span>
              </td>
            </ng-container>

            <!-- Cours Column -->
            <ng-container matColumnDef="cours">
              <th mat-header-cell *matHeaderCellDef>Cours</th>
              <td mat-cell *matCellDef="let j">
                {{ j.absence?.cours?.module }}
              </td>
            </ng-container>

            <!-- Date Absence Column -->
            <ng-container matColumnDef="dateAbsence">
              <th mat-header-cell *matHeaderCellDef>Date Absence</th>
              <td mat-cell *matCellDef="let j">
                {{ j.absence?.date | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <!-- Date Justification Column -->
            <ng-container matColumnDef="dateJustification">
              <th mat-header-cell *matHeaderCellDef>Date Justification</th>
              <td mat-cell *matCellDef="let j">
                {{ j.date | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <!-- Motif Column -->
            <ng-container matColumnDef="motif">
              <th mat-header-cell *matHeaderCellDef>Motif</th>
              <td mat-cell *matCellDef="let j">{{ j.motif }}</td>
            </ng-container>

            <!-- Statut Column -->
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let j">
                <mat-chip [ngClass]="getStatutClass(j.statut)">
                  {{ j.statut || 'EN_ATTENTE' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let j">
                <button mat-icon-button color="primary" 
                        (click)="accepter(j)"
                        [disabled]="j.statut === 'ACCEPTEE'"
                        title="Accepter">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="rejeter(j)"
                        [disabled]="j.statut === 'REFUSEE'"
                        title="Rejeter">
                  <mat-icon>cancel</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    h1 { margin-bottom: 24px; }
    .full-width { width: 100%; }
    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .loading mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .mat-mdc-chip.mat-mdc-chip-accepted {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .mat-mdc-chip.mat-mdc-chip-en-attente {
      background-color: #fff3e0 !important;
      color: #ef6c00 !important;
    }
    .mat-mdc-chip.mat-mdc-chip-refusee {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
  `]
})
export class TraiterJustificationsComponent implements OnInit {
  private justificationsFacade = inject(JustificationsFacade);
  private snackBar = inject(MatSnackBar);
  
  justifications: Justification[] = [];
  displayedColumns = ['etudiant', 'cours', 'dateAbsence', 'dateJustification', 'motif', 'statut', 'actions'];
  loading = true;

  ngOnInit() {
    this.loadJustifications();
  }

  loadJustifications() {
    this.loading = true;
    this.justificationsFacade.getAll().subscribe({
      next: (data) => {
        // Filtrer pour afficher les justifications en attente ou déjà traitées
        this.justifications = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.justifications = [];
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'ACCEPTEE': return 'mat-mdc-chip-accepted';
      case 'REFUSEE': return 'mat-mdc-chip-refusee';
      default: return 'mat-mdc-chip-en-attente';
    }
  }

  accepter(justification: Justification) {
    if (!justification.id) {
      return;
    }
    this.justificationsFacade.traiter(justification.id, StatutJustification.ACCEPTEE).subscribe({
      next: () => {
        this.snackBar.open('Justification acceptée', 'Fermer', { duration: 3000 });
        this.loadJustifications();
      },
      error: (err) => {
        this.snackBar.open('Erreur: ' + err.message, 'Fermer', { duration: 3000 });
      }
    });
  }

  rejeter(justification: Justification) {
    if (!justification.id) {
      return;
    }
    this.justificationsFacade.traiter(justification.id, StatutJustification.REFUSEE).subscribe({
      next: () => {
        this.snackBar.open('Justification rejetée', 'Fermer', { duration: 3000 });
        this.loadJustifications();
      },
      error: (err) => {
        this.snackBar.open('Erreur: ' + err.message, 'Fermer', { duration: 3000 });
      }
    });
  }
}
