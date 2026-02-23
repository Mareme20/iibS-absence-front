import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AbsencesFacade } from '../../../application/facades/absences.facade';
import { Justification, StatutJustification } from '../../../core/models/justification.model';

export interface JustifierDialogData {
  absenceId: number;
  coursModule: string;
  date: string | Date;
}

@Component({
  selector: 'app-justifier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Justifier l'absence</h2>
    <mat-dialog-content>
      <div class="dialog-content">
        <p><strong>Cours:</strong> {{ data.coursModule }}</p>
        <p><strong>Date:</strong> {{ data.date | date:'dd/MM/yyyy' }}</p>
        
        <form class="justification-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date du justificatif</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="justification.date" name="date">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Motif de l'absence</mat-label>
            <textarea matInput [(ngModel)]="justification.motif" name="motif" rows="4" 
                      placeholder="Expliquez la raison de votre absence..."></textarea>
          </mat-form-field>
        </form>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!isValid()">
        Soumettre la justification
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { min-width: 400px; padding: 16px 0; }
    .dialog-content p { margin-bottom: 16px; color: #666; }
    .justification-form { display: flex; flex-direction: column; gap: 16px; }
    .full-width { width: 100%; }
  `]
})
export class JustifierDialog {
  private absencesFacade = inject(AbsencesFacade);
  private snackBar = inject(MatSnackBar);

  justification: Justification = {
    absenceId: 0,
    date: '',
    motif: '',
    statut: StatutJustification.EN_ATTENTE
  };

  constructor(
    public dialogRef: MatDialogRef<JustifierDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JustifierDialogData
  ) {
    this.justification.absenceId = Number(data.absenceId) || 0;
    this.justification.date = data.date || '';
  }

  isValid(): boolean {
    return !!this.justification.date && !!this.justification.motif;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    const absenceId = Number(this.justification.absenceId);
    if (!absenceId) {
      this.snackBar.open('Absence invalide', 'Fermer', { duration: 3000 });
      return;
    }

    const dateStr = this.formatDate(this.justification.date);
    const motif = (this.justification.motif || '').trim();
    if (!dateStr || !motif) {
      this.snackBar.open('Date ou motif invalide', 'Fermer', { duration: 3000 });
      return;
    }

    const payload = {
      absenceId,
      date: dateStr,
      motif,
      statut: StatutJustification.EN_ATTENTE
    };

    this.absencesFacade.justify(payload).subscribe({
      next: () => {
        this.snackBar.open('Justification soumise avec succès', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Erreur lors de la soumission', 'Fermer', { duration: 4000 });
      }
    });
  }

  private formatDate(value: string | Date): string {
    if (!value) return '';
    if (value instanceof Date) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const d = String(value.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(value).split('T')[0];
  }
}
