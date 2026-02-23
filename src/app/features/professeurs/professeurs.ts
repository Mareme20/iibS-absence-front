import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfesseursFacade } from '../../application/facades/professeurs.facade';
import { Professeur, ProfesseurCreateDto } from '../../core/models/professeur.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    PageHeaderComponent,
    EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Gestion des Professeurs" subtitle="Créer et consulter les professeurs de l'IIBS" />

      <mat-card-content>
        <mat-tab-group>
          <mat-tab label="Créer un professeur">
            <div class="tab-content">
              <form class="prof-form">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Nom</mat-label>
                    <input matInput [(ngModel)]="professeurForm.nom" name="nom">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Prénom</mat-label>
                    <input matInput [(ngModel)]="professeurForm.prenom" name="prenom">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput [(ngModel)]="professeurForm.email" name="email" type="email">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Mot de passe</mat-label>
                    <input matInput [(ngModel)]="professeurForm.password" name="password" type="password">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Spécialité</mat-label>
                    <input matInput [(ngModel)]="professeurForm.specialite" name="specialite">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Grade</mat-label>
                    <input matInput [(ngModel)]="professeurForm.grade" name="grade" placeholder="Ex: Maître de conférences">
                  </mat-form-field>

                  <button mat-raised-button color="primary" (click)="saveProfesseur()" class="submit-btn">
                    <mat-icon>person_add</mat-icon>
                    Créer le professeur
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>

          <mat-tab label="Liste des professeurs">
            <div class="tab-content">
              <table mat-table [dataSource]="professors" class="mat-elevation-z2 full-width">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let p">{{ p.id }}</td>
                </ng-container>

                <ng-container matColumnDef="nom">
                  <th mat-header-cell *matHeaderCellDef>Nom</th>
                  <td mat-cell *matCellDef="let p">{{ p.user?.nom }}</td>
                </ng-container>

                <ng-container matColumnDef="prenom">
                  <th mat-header-cell *matHeaderCellDef>Prénom</th>
                  <td mat-cell *matCellDef="let p">{{ p.user?.prenom }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let p">{{ p.user?.email }}</td>
                </ng-container>

                <ng-container matColumnDef="specialite">
                  <th mat-header-cell *matHeaderCellDef>Spécialité</th>
                  <td mat-cell *matCellDef="let p">{{ p.specialite }}</td>
                </ng-container>

                <ng-container matColumnDef="grade">
                  <th mat-header-cell *matHeaderCellDef>Grade</th>
                  <td mat-cell *matCellDef="let p">{{ p.grade }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <app-empty-state *ngIf="professors.length === 0" icon="info" message="Aucun professeur trouvé" />
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .prof-form { padding: 16px 0; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .submit-btn { height: 56px; margin-top: 8px; }
  `]
})
export class ProfessorsComponent implements OnInit {
  private professeursFacade = inject(ProfesseursFacade);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'specialite', 'grade'];
  professors: Professeur[] = [];

  professeurForm: ProfesseurCreateDto = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    specialite: '',
    grade: ''
  };

  ngOnInit() {
    this.loadProfesseurs();
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

  saveProfesseur() {
    if (
      !this.professeurForm.nom ||
      !this.professeurForm.prenom ||
      !this.professeurForm.email ||
      !this.professeurForm.password ||
      !this.professeurForm.specialite ||
      !this.professeurForm.grade
    ) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    this.professeursFacade.create(this.professeurForm).subscribe({
      next: () => {
        this.snackBar.open('Professeur créé avec succès', 'Fermer', { duration: 3000 });
        this.resetForm();
        this.loadProfesseurs();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
      }
    });
  }

  resetForm() {
    this.professeurForm = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      specialite: '',
      grade: ''
    };
  }
}
