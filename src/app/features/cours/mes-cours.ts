// src/app/features/cours/mes-cours.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CoursFacade } from '../../application/facades/cours.facade';
import { EtudiantsFacade } from '../../application/facades/etudiants.facade';
import { Cours } from '../../core/models/cours.model';
import { AuthService } from '../../core/services/auth';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatCardModule, 
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatNativeDateModule,
    MatButtonModule,
    EmptyStateComponent
  ],
  template: `
    <div class="container">
      <h1>Mes Cours</h1>
      
      <!-- Filtres par période -->
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filter-row">
            <mat-form-field appearance="outline">
              <mat-label>Date début</mat-label>
              <input matInput [matDatepicker]="pickerDebut" [(ngModel)]="dateDebut" (dateChange)="onDateChange()">
              <mat-datepicker-toggle matIconSuffix [for]="pickerDebut"></mat-datepicker-toggle>
              <mat-datepicker #pickerDebut></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date fin</mat-label>
              <input matInput [matDatepicker]="pickerFin" [(ngModel)]="dateFin" (dateChange)="onDateChange()">
              <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
            </mat-form-field>

            <button mat-stroked-button color="primary" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Effacer
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-card-content>
          <div *ngIf="loading" class="loading">
            <mat-icon>hourglass_empty</mat-icon> Chargement...
          </div>
          
          <app-empty-state *ngIf="!loading && cours.length === 0" icon="class" message="Aucun cours trouvé pour cette période" color="#666" />

          <table mat-table [dataSource]="cours" *ngIf="cours.length > 0" class="full-width">
            <!-- Module Column -->
            <ng-container matColumnDef="module">
              <th mat-header-cell *matHeaderCellDef>Module</th>
              <td mat-cell *matCellDef="let c">{{ c.module }}</td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let c">{{ c.date | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <!-- Heure Debut Column -->
            <ng-container matColumnDef="heureDebut">
              <th mat-header-cell *matHeaderCellDef>Début</th>
              <td mat-cell *matCellDef="let c">{{ c.heureDebut }}</td>
            </ng-container>

            <!-- Heure Fin Column -->
            <ng-container matColumnDef="heureFin">
              <th mat-header-cell *matHeaderCellDef>Fin</th>
              <td mat-cell *matCellDef="let c">{{ c.heureFin }}</td>
            </ng-container>

            <!-- Semestre Column -->
            <ng-container matColumnDef="semestre">
              <th mat-header-cell *matHeaderCellDef>Semestre</th>
              <td mat-cell *matCellDef="let c">{{ c.semestre }}</td>
            </ng-container>

            <!-- Classes Column -->
            <ng-container matColumnDef="classes">
              <th mat-header-cell *matHeaderCellDef>Classes</th>
              <td mat-cell *matCellDef="let c">
                <span *ngFor="let classe of c.classes; let last = last">
                  {{ classe.libelle || classe.nom }}<span *ngIf="!last">, </span>
                </span>
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
    .filter-card {
      margin-bottom: 24px;
    }
    .filter-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    mat-form-field {
      min-width: 200px;
    }
  `]
})
export class MesCoursComponent implements OnInit {
  private coursFacade = inject(CoursFacade);
  private etudiantsFacade = inject(EtudiantsFacade);
  private authService = inject(AuthService);
  
  cours: Cours[] = [];
  displayedColumns = ['module', 'date', 'heureDebut', 'heureFin', 'semestre', 'classes'];
  loading = true;
  
  dateDebut: Date | null = null;
  dateFin: Date | null = null;

  ngOnInit() {
    this.loadCours();
  }

  loadCours() {
    this.loading = true;
    
    let dateDebutStr: string | undefined;
    let dateFinStr: string | undefined;
    
    if (this.dateDebut && this.dateFin) {
      dateDebutStr = this.formatDate(this.dateDebut);
      dateFinStr = this.formatDate(this.dateFin);
    }
    
    const request$ = this.authService.hasRole('ETUDIANT')
      ? this.etudiantsFacade.getMesCours(dateDebutStr, dateFinStr)
      : this.coursFacade.getMesCours(dateDebutStr, dateFinStr);

    request$.subscribe({
      next: (res) => {
        this.cours = res?.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.cours = [];
      }
    });
  }

  onDateChange() {
    if (this.dateDebut && this.dateFin) {
      this.loadCours();
    }
  }

  clearFilters() {
    this.dateDebut = null;
    this.dateFin = null;
    this.loadCours();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
