import { Injectable, inject } from '@angular/core';
import { ClasseService } from '../../core/services/classe.service';
import { Classe } from '../../core/models/classe.model';

@Injectable({ providedIn: 'root' })
export class ClassesFacade {
  private classeService = inject(ClasseService);

  getAll() {
    return this.classeService.getAll();
  }

  create(payload: Classe) {
    return this.classeService.create(payload);
  }

  update(id: number, payload: Partial<Classe>) {
    return this.classeService.update(id, payload);
  }

  delete(id: number) {
    return this.classeService.delete(id);
  }

  getEtudiantsByClasse(id: number, annee?: string) {
    return this.classeService.getEtudiantsByClasse(id, annee);
  }
}
