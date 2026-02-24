import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { AbsencesFacade } from '../../../application/facades/absences.facade';
import { Justification } from '../../../core/models/justification.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-mes-justifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    PageHeaderComponent,
    EmptyStateComponent
  ],
  template: `
    <mat-card class="m-4">
      <app-page-header title="Mes Justifications" subtitle="Historique de mes justificatifs d'absence" />

      <mat-card-content>
        <!-- Filtre par statut -->
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [(ngModel)]="statut" (ngModelChange)="applyFilters()">
              <mat-option value="">Tous</mat-option>
              <mat-option value="EN_ATTENTE">En attente</mat-option>
              <mat-option value="ACCEPTEE">Acceptée</mat-option>
              <mat-option value="REFUSEE">Refusée</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date justification</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="dateJustification" (ngModelChange)="applyFilters()">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <button mat-stroked-button color="primary" (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Effacer
          </button>
        </div>

        <table mat-table [dataSource]="justifications" class="full-width">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let j">{{j.date | date:'dd/MM/yyyy'}}</td>
          </ng-container>

          <ng-container matColumnDef="motif">
            <th mat-header-cell *matHeaderCellDef>Motif</th>
            <td mat-cell *matCellDef="let j">{{j.motif}}</td>
          </ng-container>

          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let j">
              <span [class.statut-acceptée]="j.statut === 'ACCEPTEE'" 
                    [class.statut-refusée]="j.statut === 'REFUSEE'"
                    [class.statut-pending]="!j.statut || j.statut === 'EN_ATTENTE'">
                {{j.statut || 'En attente'}}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['date', 'motif', 'statut']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['date', 'motif', 'statut'];"></tr>
        </table>

        <app-empty-state *ngIf="justifications.length === 0" icon="check_circle" message="Aucun justificatif trouvé" color="#4caf50" />
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width { width: 100%; }
    .statut-acceptée { 
      color: #4caf50; 
      font-weight: bold; 
    }
    .statut-refusée { 
      color: #f44336; 
      font-weight: bold; 
    }
    .statut-pending { 
      color: #ff9800; 
    }
    .filter-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    mat-form-field {
      min-width: 200px;
    }
  `]
})
export class MesJustificationsComponent implements OnInit {
  private absencesFacade = inject(AbsencesFacade);

  justifications: Justification[] = [];
  statut: string = '';
  dateJustification: Date | null = null;

  ngOnInit() {
    this.loadJustifications();
  }

  loadJustifications() {
    const date = this.dateJustification ? this.toYmd(this.dateJustification) : undefined;
    this.absencesFacade.getMesJustifications({
      statut: this.statut || undefined,
      dateDebut: date,
      dateFin: date
    }).subscribe({
      next: (res) => {
        this.justifications = res || [];
      },
      error: () => {
        this.justifications = [];
      }
    });
  }

  applyFilters() {
    this.loadJustifications();
  }

  clearFilters() {
    this.statut = '';
    this.dateJustification = null;
    this.loadJustifications();
  }

  private toYmd(value: Date | string): string {
    if (typeof value === 'string') {
      // Evite les décalages de timezone si l'API renvoie un ISO string
      const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
      if (m) return m[1];
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
