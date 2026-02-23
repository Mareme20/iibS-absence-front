import { Observable } from 'rxjs';
import { Justification, StatutJustification } from '../models/justification.model';
import { ApiResponse } from '../models/api.model';

/**
 * Interface pour le service de justifications
 * Définit le contrat que tout service de justifications doit implémenter
 */
export interface IJustificationService {
  /**
   * Récupérer toutes les justifications
   */
  getAll(): Observable<Justification[]>;

  /**
   * Récupérer une justification par son ID
   * @param id - ID de la justification
   */
  getById(id: number): Observable<Justification>;

  /**
   * Marquer une absence comme justifiée (pour l'ATTACHE)
   * @param absenceId - ID de l'absence
   */
  markAbsenceAsJustified(absenceId: number): Observable<ApiResponse<unknown>>;

  /**
   * Traiter une justification (accepter ou rejeter)
   * @param id - ID de la justification
   * @param statut - Nouveau statut de la justification
   */
  traiter(id: number, statut: StatutJustification): Observable<ApiResponse<unknown>>;
}
