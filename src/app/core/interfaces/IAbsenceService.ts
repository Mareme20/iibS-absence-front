import { Observable } from 'rxjs';
import { Absence, AbsenceCreateDto, AbsenceUpdateDto } from '../models/absence.model';
import { Justification } from '../models/justification.model';
import { ApiResponse } from '../models/api.model';

/**
 * Interface pour le service d'absences
 * Définit le contrat que tout service d'absences doit implémenter
 */
export interface IAbsenceService {
  /**
   * Récupérer les absences de l'étudiant connecté
   * @param date - Optionnel: filtrer par date
   */
  getMesAbsences(date?: string): Observable<Absence[]>;

  /**
   * Récupérer les justifications de l'étudiant connecté
   * @param filters - Optionnel: filtrer par période/statut
   */
  getMesJustifications(filters?: { dateDebut?: string; dateFin?: string; statut?: string }): Observable<Justification[]>;

  /**
   * Créer une nouvelle absence
   * @param absence - Données de l'absence à créer
   */
  create(absence: AbsenceCreateDto): Observable<ApiResponse<Absence>>;

  /**
   * Récupérer toutes les absences
   */
  getAll(): Observable<Absence[]>;

  /**
   * Récupérer une absence par son ID
   * @param id - ID de l'absence
   */
  getById(id: number): Observable<Absence>;

  /**
   * Récupérer les absences d'un cours
   * @param coursId - ID du cours
   * @param date - Optionnel: filtrer par date
   */
  getByCours(coursId: number, date?: string): Observable<Absence[]>;

  /**
   * Récupérer les absences d'un étudiant
   * @param etudiantId - ID de l'étudiant
   * @param date - Optionnel: filtrer par date
   */
  getByEtudiant(etudiantId: number, date?: string): Observable<Absence[]>;

  /**
   * Mettre à jour une absence
   * @param id - ID de l'absence
   * @param absence - Données mises à jour
   */
  update(id: number, absence: AbsenceUpdateDto): Observable<ApiResponse<Absence>>;

  /**
   * Supprimer une absence
   * @param id - ID de l'absence
   */
  delete(id: number): Observable<ApiResponse<null>>;

  /**
   * Soumettre une justification pour une absence
   * @param justification - Données de la justification
   */
  justify(justification: Justification): Observable<ApiResponse<unknown>>;

  /**
   * Marquer une absence comme justifiée
   * @param absenceId - ID de l'absence
   */
  markAsJustified(absenceId: number): Observable<ApiResponse<unknown>>;
}
