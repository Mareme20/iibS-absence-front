import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClassesFacade } from '../../application/facades/classes.facade';
import { Classe } from '../../core/models/classe.model';
import { EtudiantListItem } from '../../core/models/etudiant.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-etudiants-classe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    PageHeaderComponent,
    EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header
        title="Étudiants Par Classe"
        subtitle="Sélectionner une classe et une année académique"
      />

      <mat-card-content>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Classe</mat-label>
            <mat-select [(ngModel)]="selectedClasseId" name="selectedClasseId">
              <mat-option *ngFor="let c of classes" [value]="c.id">
                {{ c.libelle }} - {{ c.filiere }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Année académique</mat-label>
            <input
              matInput
              [(ngModel)]="annee"
              name="annee"
              placeholder="2026-2027"
            />
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="loadEtudiants()">
            <mat-icon>search</mat-icon> Afficher
          </button>
        </div>

        <table mat-table [dataSource]="etudiants" class="full-width" *ngIf="etudiants.length > 0">
          <ng-container matColumnDef="prenom">
            <th mat-header-cell *matHeaderCellDef>Prénom</th>
            <td mat-cell *matCellDef="let e">{{ e.user?.prenom || e.prenom }}</td>
          </ng-container>

          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let e">{{ e.user?.nom || e.nom }}</td>
          </ng-container>

          <ng-container matColumnDef="matricule">
            <th mat-header-cell *matHeaderCellDef>Matricule</th>
            <td mat-cell *matCellDef="let e">{{ e.matricule }}</td>
          </ng-container>

          <ng-container matColumnDef="adresse">
            <th mat-header-cell *matHeaderCellDef>Adresse</th>
            <td mat-cell *matCellDef="let e">{{ e.adresse }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <app-empty-state
          *ngIf="hasSearched && etudiants.length === 0"
          icon="groups"
          message="Aucun étudiant inscrit pour cette classe et cette année"
        />
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 16px;
    }
    .form-row mat-form-field {
      min-width: 240px;
      flex: 1;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class EtudiantsClasseComponent implements OnInit {
  private classesFacade = inject(ClassesFacade);
  private snackBar = inject(MatSnackBar);

  classes: Classe[] = [];
  etudiants: EtudiantListItem[] = [];
  displayedColumns: string[] = ['prenom', 'nom', 'matricule', 'adresse'];

  selectedClasseId: number | null = null;
  annee = '';
  hasSearched = false;

  ngOnInit(): void {
    this.classesFacade.getAll().subscribe({
      next: (res) => {
        this.classes = res.data || [];
      },
      error: () => {
        this.classes = [];
      }
    });
  }

  loadEtudiants() {
    if (!this.selectedClasseId) {
      this.snackBar.open('Veuillez sélectionner une classe', 'Fermer', { duration: 3000 });
      return;
    }

    const annee = (this.annee || '').trim();
    if (!annee || !/^\d{4}-\d{4}$/.test(annee)) {
      this.snackBar.open('Année académique invalide. Exemple: 2026-2027', 'Fermer', { duration: 3500 });
      return;
    }

    this.hasSearched = true;
    this.classesFacade.getEtudiantsByClasse(this.selectedClasseId, annee).subscribe({
      next: (res) => {
        this.etudiants = res.data || [];
      },
      error: (err) => {
        this.etudiants = [];
        this.snackBar.open(err?.error?.message || 'Erreur lors du chargement', 'Fermer', { duration: 3500 });
      }
    });
  }
}

