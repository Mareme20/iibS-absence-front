import { Injectable, inject } from '@angular/core';
import { ProfesseurService } from '../../core/services/professeur.service';
import { ProfesseurCreateDto } from '../../core/models/professeur.model';

@Injectable({ providedIn: 'root' })
export class ProfesseursFacade {
  private professeurService = inject(ProfesseurService);

  getAll() {
    return this.professeurService.getAll();
  }

  create(payload: ProfesseurCreateDto) {
    return this.professeurService.create(payload);
  }
}
