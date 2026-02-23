import { Injectable, inject } from '@angular/core';
import { CoursService } from '../../core/services/cours.service';
import { Cours } from '../../core/models/cours.model';

@Injectable({ providedIn: 'root' })
export class CoursFacade {
  private coursService = inject(CoursService);

  getAll() {
    return this.coursService.getAll();
  }

  getMesCours(dateDebut?: string, dateFin?: string) {
    return this.coursService.getMesCours(dateDebut, dateFin);
  }

  create(payload: Cours) {
    return this.coursService.create(payload);
  }

  update(id: number, payload: Partial<Cours>) {
    return this.coursService.update(id, payload);
  }

  delete(id: number) {
    return this.coursService.delete(id);
  }
}
