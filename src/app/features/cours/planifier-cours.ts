// planifier-cours.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { CoursFacade } from '../../application/facades/cours.facade';
import { ClassesFacade } from '../../application/facades/classes.facade';
import { ProfesseursFacade } from '../../application/facades/professeurs.facade';
import { Cours } from '../../core/models/cours.model';
import { Classe } from '../../core/models/classe.model';
import { Professeur } from '../../core/models/professeur.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-planifier-cours',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatTabsModule,
    PageHeaderComponent, EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Planifier un Cours" subtitle="Créer et gérer les cours de l'IIBS" />

      <mat-card-content>
        <mat-tab-group>
          <!-- Tab: Créer/Modifier un cours -->
          <mat-tab [label]="isEditing ? 'Modifier un cours' : 'Créer un cours'">
            <div class="tab-content">
              <form class="cours-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Module</mat-label>
                    <input matInput [(ngModel)]="coursForm.module" name="module">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Date</mat-label>
                    <input matInput [matDatepicker]="picker" [(ngModel)]="coursForm.date" name="date">
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Semestre</mat-label>
                    <mat-select [(ngModel)]="coursForm.semestre" name="semestre">
                      <mat-option value="Semestre 1">Semestre 1</mat-option>
                      <mat-option value="Semestre 2">Semestre 2</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Heure de début</mat-label>
                    <input matInput [(ngModel)]="coursForm.heureDebut" name="heureDebut" placeholder="08:00">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Heure de fin</mat-label>
                    <input matInput [(ngModel)]="coursForm.heureFin" name="heureFin" placeholder="12:00">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Professeur</mat-label>
                    <mat-select [(ngModel)]="coursForm.professeurId" name="professeurId">
                      <mat-option *ngFor="let p of professors" [value]="p.id">
                        {{p.user?.prenom}} {{p.user?.nom}} - {{p.grade}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Classes</mat-label>
                    <mat-select multiple [(ngModel)]="coursForm.classeIds" name="classeIds">
                      <mat-option *ngFor="let c of classes" [value]="c.id">{{c.libelle || c.nom}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-raised-button color="primary" (click)="saveCours()">
                    <mat-icon>{{ isEditing ? 'save' : 'event_available' }}</mat-icon>
                    {{ isEditing ? 'Mettre à jour' : 'Planifier le cours' }}
                  </button>

                  <button mat-raised-button color="warn" *ngIf="isEditing" (click)="cancelEdit()">
                    <mat-icon>cancel</mat-icon> Annuler
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Tab: Liste des cours -->
          <mat-tab label="Liste des cours">
            <div class="tab-content">
              <table mat-table [dataSource]="coursList" class="mat-elevation-z2 full-width">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef> ID </th>
                  <td mat-cell *matCellDef="let c"> {{c.id}} </td>
                </ng-container>

                <ng-container matColumnDef="module">
                  <th mat-header-cell *matHeaderCellDef> Module </th>
                  <td mat-cell *matCellDef="let c"> {{c.module}} </td>
                </ng-container>

                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef> Date </th>
                  <td mat-cell *matCellDef="let c"> {{c.date | date:'dd/MM/yyyy'}} </td>
                </ng-container>

                <ng-container matColumnDef="semestre">
                  <th mat-header-cell *matHeaderCellDef> Semestre </th>
                  <td mat-cell *matCellDef="let c"> {{c.semestre}} </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> Actions </th>
                  <td mat-cell *matCellDef="let c">
                    <button mat-icon-button color="primary" (click)="editCours(c)" title="Modifier">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteCours(c)" title="Supprimer">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <app-empty-state *ngIf="coursList.length === 0" icon="info" message="Aucun cours trouvé" />
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .cours-form { padding: 16px 0; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .form-actions { margin-top: 16px; display: flex; gap: 8px; }
    .form-actions button { height: 48px; }
  `]
})
export class PlanifierCoursComponent implements OnInit {
  private coursFacade = inject(CoursFacade);
  private classesFacade = inject(ClassesFacade);
  private professeursFacade = inject(ProfesseursFacade);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'module', 'date', 'semestre', 'actions'];
  classes: Classe[] = [];
  professors: Professeur[] = [];
  coursList: Cours[] = [];

  coursForm: Cours = {
    module: '',
    date: '',
    heureDebut: '',
    heureFin: '',
    semestre: '',
    professeurId: 0,
    classeIds: []
  };

  isEditing = false;
  editingId: number | null = null;

  ngOnInit() {
    this.loadClasses();
    this.loadProfesseurs();
    this.loadCours();
  }

  loadClasses() {
    this.classesFacade.getAll().subscribe({
      next: (res) => {
        this.classes = res.data || [];
      }
    });
  }

  loadProfesseurs() {
    this.professeursFacade.getAll().subscribe({
      next: (res) => {
        this.professors = res.data || [];
      },
      error: () => {
        this.professors = [];
      }
    });
  }

  loadCours() {
    this.coursFacade.getAll().subscribe({
      next: (res) => {
        this.coursList = res.data || [];
      },
      error: () => {
        this.coursList = [];
      }
    });
  }

  saveCours() {
    if (!this.coursForm.module || !this.coursForm.date || !this.coursForm.heureDebut || 
        !this.coursForm.heureFin || !this.coursForm.semestre || !this.coursForm.professeurId ||
        (this.coursForm.classeIds?.length ?? 0) === 0) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    const dateStr = typeof this.coursForm.date === 'object' && this.coursForm.date !== null
      ? (this.coursForm.date as Date).toISOString().split('T')[0] 
      : this.coursForm.date;

    const payload = {
      ...this.coursForm,
      date: dateStr
    };

    if (this.isEditing && this.editingId) {
      this.coursFacade.update(this.editingId, payload).subscribe({
        next: () => {
          this.snackBar.open('Cours mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.cancelEdit();
          this.loadCours();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.coursFacade.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Cours planifié avec succès', 'Fermer', { duration: 3000 });
          this.resetForm();
          this.loadCours();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  editCours(cours: Cours) {
    if (!cours.id) {
      return;
    }
    this.isEditing = true;
    this.editingId = cours.id;
    this.coursForm = {
      module: cours.module,
      date: new Date(cours.date),
      heureDebut: cours.heureDebut,
      heureFin: cours.heureFin,
      semestre: cours.semestre,
      professeurId: cours.professeurId || cours.professeur?.id || 0,
      classeIds: cours.classes?.map((c) => c.id).filter((id): id is number => !!id) || []
    };
  }

  deleteCours(cours: Cours) {
    if (!cours.id) {
      this.snackBar.open('Cours invalide', 'Fermer', { duration: 3000 });
      return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${cours.module}" ?`)) {
      this.coursFacade.delete(cours.id).subscribe({
        next: () => {
          this.snackBar.open('Cours supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadCours();
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
    this.coursForm = {
      module: '',
      date: '',
      heureDebut: '',
      heureFin: '',
      semestre: '',
      professeurId: 0,
      classeIds: []
    };
  }
}
