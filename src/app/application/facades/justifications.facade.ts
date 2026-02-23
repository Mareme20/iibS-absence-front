import { Injectable, inject } from '@angular/core';
import { JustificationService } from '../../core/services/justification.service';
import { StatutJustification } from '../../core/models/justification.model';

@Injectable({ providedIn: 'root' })
export class JustificationsFacade {
  private justificationService = inject(JustificationService);

  getAll() {
    return this.justificationService.getAll();
  }

  traiter(id: number, statut: StatutJustification) {
    return this.justificationService.traiter(id, statut);
  }
}
