// classes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Services
import { ClassesFacade } from '../../application/facades/classes.facade';
import { Classe } from '../../core/models/classe.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatSnackBarModule,
    PageHeaderComponent, EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Gestion des Classes" subtitle="Créer et gérer les classes de l'IIBS" />

      <mat-card-content>
        <!-- Formulaire de création / édition -->
        <div class="create-form">
          <h3>{{ isEditing ? 'Modifier la classe' : 'Créer une nouvelle classe' }}</h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Libellé</mat-label>
              <input matInput [(ngModel)]="classeForm.libelle" placeholder="L3 Génie Logiciel">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Filière</mat-label>
              <input matInput [(ngModel)]="classeForm.filiere" placeholder="Informatique">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Niveau</mat-label>
              <mat-select [(ngModel)]="classeForm.niveau">
                <mat-option value="L1">L1</mat-option>
                <mat-option value="L2">L2</mat-option>
                <mat-option value="L3">L3</mat-option>
                <mat-option value="M1">M1</mat-option>
                <mat-option value="M2">M2</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="saveClasse()">
              <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
              {{ isEditing ? 'Mettre à jour' : 'Créer' }}
            </button>

            <button mat-raised-button color="warn" *ngIf="isEditing" (click)="cancelEdit()">
              <mat-icon>cancel</mat-icon> Annuler
            </button>
          </div>
        </div>

        <!-- Liste des classes -->
        <div class="table-container">
          <h3>Liste des classes</h3>
          <table mat-table [dataSource]="classes" class="mat-elevation-z2 full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let c"> {{c.id}} </td>
            </ng-container>

            <ng-container matColumnDef="libelle">
              <th mat-header-cell *matHeaderCellDef> Libellé </th>
              <td mat-cell *matCellDef="let c"> {{c.libelle}} </td>
            </ng-container>

            <ng-container matColumnDef="filiere">
              <th mat-header-cell *matHeaderCellDef> Filière </th>
              <td mat-cell *matCellDef="let c"> {{c.filiere}} </td>
            </ng-container>

            <ng-container matColumnDef="niveau">
              <th mat-header-cell *matHeaderCellDef> Niveau </th>
              <td mat-cell *matCellDef="let c"> {{c.niveau}} </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button color="primary" (click)="editClasse(c)" title="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteClasse(c)" title="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <app-empty-state *ngIf="classes.length === 0" icon="info" message="Aucune classe trouvée" />
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .create-form { 
      background: #f5f5f5; 
      padding: 16px; 
      border-radius: 8px; 
      margin-bottom: 24px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .table-container { margin-top: 16px; }
  `]
})
export class ClassesComponent implements OnInit {
  private classesFacade = inject(ClassesFacade);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'libelle', 'filiere', 'niveau', 'actions'];
  classes: Classe[] = [];

  // Formulaire
  classeForm: Classe = {
    libelle: '',
    filiere: '',
    niveau: ''
  };

  isEditing = false;
  editingId: number | null = null;

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classesFacade.getAll().subscribe({
      next: (res) => {
        if (res && res.success === false) {
          this.classes = [];
          this.snackBar.open(res.message || 'Erreur de chargement', 'Fermer', { duration: 3000 });
        } else {
          this.classes = res?.data || [];
        }
      },
      error: (err) => {
        console.error('Erreur chargement classes:', err);
        this.classes = [];
      }
    });
  }

  saveClasse() {
    if (!this.classeForm.libelle || !this.classeForm.filiere || !this.classeForm.niveau) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    if (this.isEditing && this.editingId) {
      this.classesFacade.update(this.editingId, this.classeForm).subscribe({
        next: (res) => {
          if (res && res.success === false) {
            this.snackBar.open(res.message || 'Erreur de mise à jour', 'Fermer', { duration: 3000 });
          } else {
            this.snackBar.open('Classe mise à jour avec succès', 'Fermer', { duration: 3000 });
            this.cancelEdit();
            this.loadClasses();
          }
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.classesFacade.create(this.classeForm).subscribe({
        next: (res) => {
          if (res && res.success === false) {
            this.snackBar.open(res.message || 'Erreur de création', 'Fermer', { duration: 3000 });
          } else {
            this.snackBar.open('Classe créée avec succès', 'Fermer', { duration: 3000 });
            this.resetForm();
            this.loadClasses();
          }
        },
        error: (err) => {
          console.error('Erreur création:', err);
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  editClasse(classe: Classe) {
    this.isEditing = true;
    this.editingId = classe.id || null;
    this.classeForm = { ...classe };
  }

  deleteClasse(classe: Classe) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.libelle}" ?`)) {
      this.classesFacade.delete(classe.id!).subscribe({
        next: () => {
          this.snackBar.open('Classe supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadClasses();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  resetForm() {
    this.classeForm = {
      libelle: '',
      filiere: '',
      niveau: ''
    };
  }
}
