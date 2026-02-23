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

  create(payload: AbsenceCreateDto) {
    return this.absenceService.create(payload);
  }

  getMesAbsences() {
    return this.absenceService.getMesAbsences();
  }

  getMesJustifications() {
    return this.absenceService.getMesJustifications();
  }

  justify(payload: Justification) {
    return this.absenceService.justify(payload);
  }
}
