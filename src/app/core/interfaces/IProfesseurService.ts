import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { Professeur, ProfesseurCreateDto } from '../models/professeur.model';

/**
 * Interface pour le service de professeurs
 * Définit le contrat que tout service de professeurs doit implémenter
 */
export interface IProfesseurService {
  /**
   * Créer un nouveau professeur
   * @param professeur - Données du professeur
   */
  create(professeur: ProfesseurCreateDto): Observable<ApiResponse<Professeur>>;

  /**
   * Récupérer tous les professeurs
   */
  getAll(): Observable<ApiResponse<Professeur[]>>;
}
