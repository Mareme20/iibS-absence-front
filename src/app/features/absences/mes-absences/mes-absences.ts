// mes-absences.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsencesFacade } from '../../../application/facades/absences.facade';
import { MatDialog } from '@angular/material/dialog';
import { JustifierDialog, JustifierDialogData } from '../justifier-dialog/justifier-dialog';
import { Absence } from '../../../core/models/absence.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatutJustification } from '../../../core/models/justification.model';

@Component({
  selector: 'app-mes-absences',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatCardModule, 
    MatChipsModule, 
    MatIconModule, 
    MatButtonModule,
    PageHeaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './mes-absences.html',
  styleUrls: ['./mes-absences.css']
})
export class MesAbsencesComponent implements OnInit {
  private absencesFacade = inject(AbsencesFacade);
  private dialog = inject(MatDialog);
  
  // Colonnes à afficher dans le tableau
  displayedColumns: string[] = ['date', 'cours', 'heures', 'statut', 'actions'];
  absences: Absence[] = [];

  ngOnInit() {
    this.loadAbsences();
  }

  loadAbsences() {
    this.absencesFacade.getMesAbsences().subscribe(data => {
      this.absences = data;
    });
  }

  openJustifyDialog(absence: Absence) {
    const dialogRef = this.dialog.open(JustifierDialog, {
      width: '500px',
      data: {
        absenceId: absence.id,
        coursModule: absence.cours?.module || 'Cours',
        date: absence.date
      } as JustifierDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAbsences();
      }
    });
  }

  getEtatLabel(absence: Absence): string {
    const statut = absence.justification?.statut;
    if (statut === StatutJustification.ACCEPTEE || absence.estJustifiee) return 'Justifiée';
    if (statut === StatutJustification.REFUSEE) return 'Justification refusée';
    if (statut === StatutJustification.EN_ATTENTE || absence.justification) return 'Justification en attente';
    return 'Non Justifiée';
  }

  getEtatColor(absence: Absence): 'primary' | 'accent' | 'warn' {
    const statut = absence.justification?.statut;
    if (statut === StatutJustification.ACCEPTEE || absence.estJustifiee) return 'accent';
    if (statut === StatutJustification.EN_ATTENTE || absence.justification) return 'primary';
    return 'warn';
  }
}
