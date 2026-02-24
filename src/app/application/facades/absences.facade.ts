import { Injectable, inject } from '@angular/core';
import { AbsenceService } from '../../core/services/absence.service';
import { AbsenceCreateDto } from '../../core/models/absence.model';
import { Justification } from '../../core/models/justification.model';

@Injectable({ providedIn: 'root' })
export class AbsencesFacade {
  private absenceService = inject(AbsenceService);

  getAll() {
    return this.absenceService.getAll();
  }

  getByCours(coursId: number, date?: string) {
    return this.absenceService.getByCours(coursId, date);
  }

  getByEtudiant(etudiantId: number, date?: string) {
    return this.absenceService.getByEtudiant(etudiantId, date);
  }

  create(payload: AbsenceCreateDto) {
    return this.absenceService.create(payload);
  }

  getMesAbsences() {
    return this.absenceService.getMesAbsences();
  }

  getMesJustifications(filters?: { dateDebut?: string; dateFin?: string; statut?: string }) {
    return this.absenceService.getMesJustifications(filters);
  }

  justify(payload: Justification) {
    return this.absenceService.justify(payload);
  }
}
