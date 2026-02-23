import { Injectable, inject } from '@angular/core';
import { EtudiantService } from '../../core/services/etudiant.service';
import { EtudiantCreateDto, EtudiantUpdateDto, Inscription } from '../../core/models/etudiant.model';

@Injectable({ providedIn: 'root' })
export class EtudiantsFacade {
  private etudiantService = inject(EtudiantService);

  getAll() {
    return this.etudiantService.getAll();
  }

  create(payload: EtudiantCreateDto) {
    return this.etudiantService.create(payload);
  }

  update(id: number, payload: EtudiantUpdateDto) {
    return this.etudiantService.update(id, payload);
  }

  delete(id: number) {
    return this.etudiantService.delete(id);
  }

  inscrire(payload: Inscription) {
    return this.etudiantService.inscription(payload);
  }
}
