import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { CoursFacade } from '../../../application/facades/cours.facade';
import { AbsencesFacade } from '../../../application/facades/absences.facade';
import { EtudiantsFacade } from '../../../application/facades/etudiants.facade';
import { ClassesFacade } from '../../../application/facades/classes.facade';
import { AuthService } from '../../../core/services/auth';
import { Cours } from '../../../core/models/cours.model';
import { Absence, AbsenceCreateDto } from '../../../core/models/absence.model';
import { Classe } from '../../../core/models/classe.model';
import { EtudiantListItem } from '../../../core/models/etudiant.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-enregistrer-absence',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule,
    MatTableModule, PageHeaderComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Enregistrer une Absence" subtitle="Marquer les étudiants absents à un cours" />

      <mat-card-content>
        <form class="absence-form">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cours</mat-label>
              <mat-select [(ngModel)]="selectedCoursId" name="coursId" (selectionChange)="onCoursChange()">
                <mat-option *ngFor="let c of cours" [value]="c.id">
                  {{c.module}} - {{c.date | date:'dd/MM/yyyy'}} ({{c.heureDebut}}-{{c.heureFin}})
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date de l'absence</mat-label>
              <input matInput [matDatepicker]="picker" [(ngModel)]="absence.date" name="date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre d'heures</mat-label>
              <input matInput type="number" [(ngModel)]="absence.nombreHeures" name="nombreHeures" min="1" max="8">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Classe</mat-label>
              <mat-select [(ngModel)]="selectedClasseId" name="classeId" (selectionChange)="onClasseChange()">
                <mat-option *ngFor="let c of classes" [value]="c.id">
                  {{c.libelle || c.nom}} - {{c.filiere || c.filliere}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Étudiant</mat-label>
              <mat-select [(ngModel)]="absence.etudiantId" name="etudiantId" [disabled]="!selectedClasseId">
                <mat-option *ngFor="let e of etudiants" [value]="e.id">
                  {{getEtudiantLabel(e)}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="enregistrerAbsence()" [disabled]="!canCreateAbsence">
              <mat-icon>fact_check</mat-icon> Enregistrer l'absence
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Liste des absences récentes -->
    <mat-card class="m-4">
      <app-page-header title="Absences récentes" />
      <mat-card-content>
        <table mat-table [dataSource]="absencesRecentes" class="full-width">
          <ng-container matColumnDef="etudiant">
            <th mat-header-cell *matHeaderCellDef>Étudiant</th>
            <td mat-cell *matCellDef="let a">{{a.etudiant?.matricule || 'N/A'}}</td>
          </ng-container>
          <ng-container matColumnDef="cours">
            <th mat-header-cell *matHeaderCellDef>Cours</th>
            <td mat-cell *matCellDef="let a">{{a.cours?.module}}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let a">{{a.date | date:'dd/MM/yyyy'}}</td>
          </ng-container>
          <ng-container matColumnDef="nombreHeures">
            <th mat-header-cell *matHeaderCellDef>Heures</th>
            <td mat-cell *matCellDef="let a">{{a.nombreHeures}}h</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['etudiant', 'cours', 'date', 'nombreHeures']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['etudiant', 'cours', 'date', 'nombreHeures'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    <mat-card class="m-4" *ngIf="canViewEtudiantAbsences">
      <app-page-header title="Absences d'un étudiant" subtitle="Recherche ciblée par étudiant" />
      <mat-card-content>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Étudiant</mat-label>
            <mat-select [(ngModel)]="selectedEtudiantAbsenceId" name="selectedEtudiantAbsenceId" (selectionChange)="loadAbsencesEtudiant()">
              <mat-option *ngFor="let e of allEtudiants" [value]="e.id">
                {{getEtudiantLabel(e)}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Date (optionnel)</mat-label>
            <input matInput [matDatepicker]="pickerAbsEtu" [(ngModel)]="dateAbsenceEtudiant" name="dateAbsenceEtudiant">
            <mat-datepicker-toggle matIconSuffix [for]="pickerAbsEtu"></mat-datepicker-toggle>
            <mat-datepicker #pickerAbsEtu></mat-datepicker>
          </mat-form-field>
          <button mat-stroked-button color="primary" (click)="loadAbsencesEtudiant()">
            <mat-icon>search</mat-icon> Rechercher
          </button>
        </div>

        <table mat-table [dataSource]="absencesEtudiant" class="full-width">
          <ng-container matColumnDef="cours">
            <th mat-header-cell *matHeaderCellDef>Cours</th>
            <td mat-cell *matCellDef="let a">{{a.cours?.module || '-'}}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let a">{{a.date | date:'dd/MM/yyyy'}}</td>
          </ng-container>
          <ng-container matColumnDef="nombreHeures">
            <th mat-header-cell *matHeaderCellDef>Heures</th>
            <td mat-cell *matCellDef="let a">{{a.nombreHeures}}h</td>
          </ng-container>
          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let a">{{a.estJustifiee ? 'Justifiée' : 'Non justifiée'}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['cours', 'date', 'nombreHeures', 'statut']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['cours', 'date', 'nombreHeures', 'statut'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .absence-form { padding: 16px 0; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .form-actions { margin-top: 16px; }
    .form-actions button { height: 48px; }
  `]
})
export class EnregistrerAbsenceComponent implements OnInit {
  private coursFacade = inject(CoursFacade);
  private absencesFacade = inject(AbsencesFacade);
  private etudiantsFacade = inject(EtudiantsFacade);
  private classesFacade = inject(ClassesFacade);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  cours: Cours[] = [];
  allEtudiants: EtudiantListItem[] = [];
  etudiants: EtudiantListItem[] = [];
  classes: Classe[] = [];
  absencesRecentes: Absence[] = [];
  absencesEtudiant: Absence[] = [];
  
  selectedCoursId: number | null = null;
  selectedClasseId: number | null = null;
  selectedEtudiantAbsenceId: number | null = null;
  dateAbsenceEtudiant: Date | null = null;
  canViewEtudiantAbsences = false;
  canCreateAbsence = false;
  
  absence: Absence = {
    etudiantId: 0,
    coursId: 0,
    date: '',
    nombreHeures: 1,
    estJustifiee: false
  };

  ngOnInit() {
    this.canViewEtudiantAbsences = this.authService.hasRole('ATTACHE') || this.authService.hasRole('RP');
    this.canCreateAbsence = this.authService.hasRole('PROF');
    this.loadCours();
    this.loadAllEtudiants();
    this.loadAbsencesRecentes();
  }

  loadCours() {
    const coursRequest$ = this.authService.hasRole('PROF')
      ? this.coursFacade.getMesCours()
      : this.coursFacade.getAll();

    coursRequest$.subscribe({
      next: (res) => {
        this.cours = res.data || [];
      },
      error: () => {
        this.cours = [];
        this.snackBar.open("Impossible de charger les cours", "Fermer", { duration: 3000 });
      }
    });
  }

  loadEtudiants() {
    if (!this.selectedClasseId) {
      this.etudiants = [];
      return;
    }
    this.classesFacade.getEtudiantsByClasse(this.selectedClasseId).subscribe({
      next: (res) => {
        this.etudiants = res.data || [];
      },
      error: (err) => {
        this.etudiants = [];
        const message =
          err?.status === 0
            ? "API inaccessible (vérifie Render/CORS et l'URL backend)"
            : err?.status === 401
              ? "Session expirée, reconnecte-toi"
              : err?.status === 403
                ? "Accès refusé (rôle non autorisé côté backend)"
                : err?.error?.message || `Erreur HTTP ${err?.status || ""}`.trim();
        this.snackBar.open(
          message,
          "Fermer",
          { duration: 3000 }
        );
      }
    });
  }

  loadAllEtudiants() {
    this.etudiantsFacade.getAll().subscribe({
      next: (res) => {
        this.allEtudiants = res.data || [];
      },
      error: () => {
        this.allEtudiants = [];
      }
    });
  }

  loadAbsencesRecentes() {
    if (!this.selectedCoursId) {
      this.absencesFacade.getAll().subscribe({
        next: (data) => {
          this.absencesRecentes = data || [];
        },
        error: () => {
          this.absencesRecentes = [];
        }
      });
      return;
    }

    this.absencesFacade.getByCours(this.selectedCoursId).subscribe({
      next: (data) => {
        this.absencesRecentes = data || [];
      },
      error: () => {
        this.absencesRecentes = [];
      }
    });
  }

  onClasseChange() {
    this.loadEtudiants();
    this.absence.etudiantId = 0;
  }

  onCoursChange() {
    this.selectedClasseId = null;
    this.absence.etudiantId = 0;
    this.etudiants = [];

    if (!this.selectedCoursId) {
      this.absence.coursId = 0;
      this.classes = [];
      this.loadAbsencesRecentes();
      return;
    }

    this.absence.coursId = this.selectedCoursId;
    const selectedCours = this.cours.find((c) => c.id === this.selectedCoursId);
    this.classes = selectedCours?.classes || [];
    this.loadAbsencesRecentes();
  }

  loadAbsencesEtudiant() {
    if (!this.canViewEtudiantAbsences) {
      this.snackBar.open('Accès réservé à l’attaché ou au RP', 'Fermer', { duration: 3000 });
      return;
    }

    if (!this.selectedEtudiantAbsenceId) {
      this.absencesEtudiant = [];
      return;
    }

    const date = this.dateAbsenceEtudiant
      ? this.toYmdLocal(this.dateAbsenceEtudiant)
      : undefined;

    this.absencesFacade.getByEtudiant(this.selectedEtudiantAbsenceId, date).subscribe({
      next: (data) => {
        this.absencesEtudiant = data || [];
      },
      error: (err) => {
        this.absencesEtudiant = [];
        this.snackBar.open(err?.error?.message || 'Erreur lors du chargement des absences', 'Fermer', { duration: 3000 });
      }
    });
  }

  enregistrerAbsence() {
    if (!this.canCreateAbsence) {
      this.snackBar.open('Action réservée aux professeurs', 'Fermer', { duration: 3000 });
      return;
    }

    if (!this.absence.etudiantId || !this.absence.coursId || 
        !this.absence.date || !this.absence.nombreHeures) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    const dateStr = typeof this.absence.date === 'object' && this.absence.date !== null
      ? this.toYmdLocal(this.absence.date as Date)
      : this.absence.date;

    const payload: AbsenceCreateDto = {
      etudiantId: this.absence.etudiantId as number,
      coursId: this.absence.coursId as number,
      date: dateStr,
      nombreHeures: this.absence.nombreHeures
    };

    this.absencesFacade.create(payload).subscribe({
      next: () => {
        this.snackBar.open('Absence enregistrée avec succès', 'Fermer', { duration: 3000 });
        this.absence = { etudiantId: 0, coursId: 0, date: '', nombreHeures: 1, estJustifiee: false };
        this.loadAbsencesRecentes();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }

  getEtudiantLabel(etudiant: EtudiantListItem): string {
    const prenom = etudiant?.user?.prenom || etudiant?.prenom || '';
    const nom = etudiant?.user?.nom || etudiant?.nom || '';
    const matricule = etudiant?.matricule || '';
    return `${prenom} ${nom}`.trim() + (matricule ? ` (${matricule})` : '');
  }

  private toYmdLocal(value: Date): string {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
