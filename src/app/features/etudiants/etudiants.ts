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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { EtudiantsFacade } from '../../application/facades/etudiants.facade';
import { ClassesFacade } from '../../application/facades/classes.facade';
import { Classe } from '../../core/models/classe.model';
import { Etudiant, EtudiantListItem, EtudiantUpdateDto, Inscription } from '../../core/models/etudiant.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-etudiants',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatTabsModule, PageHeaderComponent, EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Gestion des Étudiants" subtitle="Créer des étudiants et les inscrire dans les classes" />

      <mat-card-content>
        <mat-tab-group>
          <!-- Tab: Créer/Modifier un étudiant -->
          <mat-tab [label]="isEditing ? 'Modifier un étudiant' : 'Créer un étudiant'">
            <div class="tab-content">
              <form class="etudiant-form">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Nom</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.nom" name="nom">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Prénom</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.prenom" name="prenom">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.email" name="email" type="email">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Matricule</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.matricule" name="matricule">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Adresse</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.adresse" name="adresse">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" *ngIf="!isEditing">
                    <mat-label>Mot de passe</mat-label>
                    <input matInput [(ngModel)]="etudiantForm.password" name="password" type="password">
                  </mat-form-field>

                  <button mat-raised-button color="primary" (click)="saveEtudiant()" class="submit-btn">
                    <mat-icon>{{ isEditing ? 'save' : 'person_add' }}</mat-icon>
                    {{ isEditing ? 'Mettre à jour' : 'Créer l\'étudiant' }}
                  </button>

                  <button mat-raised-button color="warn" *ngIf="isEditing" (click)="cancelEdit()" class="submit-btn">
                    <mat-icon>cancel</mat-icon> Annuler
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Tab: Liste des étudiants -->
          <mat-tab label="Liste des étudiants">
            <div class="tab-content">
              <table mat-table [dataSource]="etudiants" class="mat-elevation-z2 full-width">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef> ID </th>
                  <td mat-cell *matCellDef="let e"> {{e.id}} </td>
                </ng-container>

                <ng-container matColumnDef="nom">
                  <th mat-header-cell *matHeaderCellDef> Nom </th>
                  <td mat-cell *matCellDef="let e"> {{getNom(e)}} </td>
                </ng-container>

                <ng-container matColumnDef="prenom">
                  <th mat-header-cell *matHeaderCellDef> Prénom </th>
                  <td mat-cell *matCellDef="let e"> {{getPrenom(e)}} </td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef> Email </th>
                  <td mat-cell *matCellDef="let e"> {{getEmail(e)}} </td>
                </ng-container>

                <ng-container matColumnDef="matricule">
                  <th mat-header-cell *matHeaderCellDef> Matricule </th>
                  <td mat-cell *matCellDef="let e"> {{e.matricule}} </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> Actions </th>
                  <td mat-cell *matCellDef="let e">
                    <button mat-icon-button color="primary" (click)="editEtudiant(e)" title="Modifier">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteEtudiant(e)" title="Supprimer">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <app-empty-state *ngIf="etudiants.length === 0" icon="info" message="Aucun étudiant trouvé" />
            </div>
          </mat-tab>

          <!-- Tab: Inscrire un étudiant -->
          <mat-tab label="Inscrire un étudiant">
            <div class="tab-content">
              <form class="inscription-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Étudiant</mat-label>
                    <mat-select [(ngModel)]="inscription.etudiantId" name="etudiantId">
                      <mat-option *ngFor="let e of etudiants" [value]="e.id">
                        {{getPrenom(e)}} {{getNom(e)}} ({{e.matricule}})
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Classe</mat-label>
                    <mat-select [(ngModel)]="inscription.classeId" name="classeId">
                      <mat-option *ngFor="let c of classes" [value]="c.id">
                        {{c.libelle}} - {{c.filiere}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Année académique</mat-label>
                    <input
                      matInput
                      [(ngModel)]="inscription.annee"
                      name="annee"
                      placeholder="2026-2027">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <button mat-raised-button color="primary" (click)="inscrireEtudiant()" class="submit-btn">
                    <mat-icon>school</mat-icon> Inscrire l'étudiant
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .submit-btn { height: 56px; margin-top: 8px; }
    .etudiant-form, .inscription-form { padding: 16px 0; }
  `]
})
export class EtudiantsComponent implements OnInit {
  private etudiantsFacade = inject(EtudiantsFacade);
  private classesFacade = inject(ClassesFacade);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'matricule', 'actions'];
  etudiants: EtudiantListItem[] = [];
  classes: Classe[] = [];

  etudiantForm: Etudiant = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    matricule: '',
    adresse: ''
  };

  inscription: Inscription = {
    etudiantId: 0,
    classeId: 0,
    annee: ''
  };

  isEditing = false;
  editingId: number | null = null;

  ngOnInit() {
    this.loadEtudiants();
    this.loadClasses();
  }

  loadEtudiants() {
    this.etudiantsFacade.getAll().subscribe({
      next: (res) => {
        this.etudiants = res.data || [];
      },
      error: () => {
        this.etudiants = [];
      }
    });
  }

  loadClasses() {
    this.classesFacade.getAll().subscribe({
      next: (res) => {
        this.classes = res.data || [];
      }
    });
  }

  saveEtudiant() {
    if (!this.etudiantForm.nom || !this.etudiantForm.prenom || !this.etudiantForm.email ||
        !this.etudiantForm.matricule || !this.etudiantForm.adresse) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    if (this.isEditing && this.editingId) {
      const payload: EtudiantUpdateDto = {
        matricule: this.etudiantForm.matricule,
        adresse: this.etudiantForm.adresse
      };
      this.etudiantsFacade.update(this.editingId, payload).subscribe({
        next: () => {
          this.snackBar.open('Étudiant mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.cancelEdit();
          this.loadEtudiants();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      if (!this.etudiantForm.password) {
        this.snackBar.open('Veuillez entrer un mot de passe', 'Fermer', { duration: 3000 });
        return;
      }
      this.etudiantsFacade.create(this.etudiantForm).subscribe({
        next: () => {
          this.snackBar.open('Étudiant créé avec succès', 'Fermer', { duration: 3000 });
          this.resetForm();
          this.loadEtudiants();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  editEtudiant(etudiant: EtudiantListItem) {
    this.isEditing = true;
    this.editingId = etudiant.id || null;
    this.etudiantForm = { 
      nom: this.getNom(etudiant), 
      prenom: this.getPrenom(etudiant), 
      email: this.getEmail(etudiant), 
      matricule: etudiant.matricule, 
      adresse: etudiant.adresse 
    };
  }

  deleteEtudiant(etudiant: EtudiantListItem) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${this.getPrenom(etudiant)} ${this.getNom(etudiant)}" ?`)) {
      this.etudiantsFacade.delete(etudiant.id!).subscribe({
        next: () => {
          this.snackBar.open('Étudiant supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadEtudiants();
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
    this.etudiantForm = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      matricule: '',
      adresse: ''
    };
  }

  inscrireEtudiant() {
    if (!this.inscription.etudiantId || !this.inscription.classeId || !this.inscription.annee) {
      this.snackBar.open('Veuillez sélectionner un étudiant, une classe et une année', 'Fermer', { duration: 3000 });
      return;
    }

    const annee = (this.inscription.annee || '').trim();
    if (!/^\d{4}-\d{4}$/.test(annee)) {
      this.snackBar.open('Format année invalide. Exemple: 2026-2027', 'Fermer', { duration: 3500 });
      return;
    }

    this.etudiantsFacade.inscrire({ ...this.inscription, annee }).subscribe({
      next: () => {
        this.snackBar.open('Étudiant inscrit avec succès', 'Fermer', { duration: 3000 });
        this.inscription = { etudiantId: 0, classeId: 0, annee: '' };
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Erreur lors de l\'inscription', 'Fermer', { duration: 3500 });
      }
    });
  }

  getNom(etudiant: EtudiantListItem): string {
    return etudiant?.user?.nom || etudiant?.nom || '';
  }

  getPrenom(etudiant: EtudiantListItem): string {
    return etudiant?.user?.prenom || etudiant?.prenom || '';
  }

  getEmail(etudiant: EtudiantListItem): string {
    return etudiant?.user?.email || etudiant?.email || '';
  }
}
