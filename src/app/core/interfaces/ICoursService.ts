import { Observable } from 'rxjs';
import { Cours } from '../models/cours.model';
import { ApiResponse } from '../models/api.model';

/**
 * Interface pour le service de cours
 * Définit le contrat que tout service de cours doit implémenter
 */
export interface ICoursService {
  /**
   * Récupérer tous les cours
   */
  getAll(): Observable<ApiResponse<Cours[]>>;

  /**
   * Récupérer les cours du professeur connecté
   * @param dateDebut - Optionnel: date de début
   * @param dateFin - Optionnel: date de fin
   */
  getMesCours(dateDebut?: string, dateFin?: string): Observable<ApiResponse<Cours[]>>;

  /**
   * Récupérer un cours par son ID
   * @param id - ID du cours
   */
  getById(id: number): Observable<ApiResponse<Cours>>;

  /**
   * Créer un nouveau cours
   * @param cours - Données du cours
   */
  create(cours: Cours): Observable<ApiResponse<Cours>>;

  /**
   * Mettre à jour un cours
   * @param id - ID du cours
   * @param cours - Données mises à jour
   */
  update(id: number, cours: Partial<Cours>): Observable<ApiResponse<Cours>>;

  /**
   * Supprimer un cours
   * @param id - ID du cours
   */
  delete(id: number): Observable<ApiResponse<null>>;
}
