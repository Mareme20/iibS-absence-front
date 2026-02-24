import { Observable } from 'rxjs';
import {
  Etudiant,
  EtudiantCreateDto,
  EtudiantListItem,
  EtudiantUpdateDto,
  Inscription
} from '../models/etudiant.model';
import { Absence } from '../models/absence.model';
import { Justification } from '../models/justification.model';
import { Cours } from '../models/cours.model';
import { ApiResponse } from '../models/api.model';

/**
 * Interface pour le service d'étudiants
 * Définit le contrat que tout service d'étudiants doit implémenter
 */
export interface IEtudiantService {
  /**
   * Créer un nouvel étudiant
   * @param etudiant - Données de l'étudiant
   */
  create(etudiant: EtudiantCreateDto): Observable<ApiResponse<Etudiant>>;

  /**
   * Récupérer tous les étudiants
   */
  getAll(): Observable<ApiResponse<EtudiantListItem[]>>;

  /**
   * Récupérer un étudiant par son ID
   * @param id - ID de l'étudiant
   */
  getById(id: number): Observable<ApiResponse<EtudiantListItem>>;

  /**
   * Inscrire un étudiant
   * @param data - Données d'inscription
   */
  inscription(data: Inscription): Observable<ApiResponse<unknown>>;

  /**
   * Récupérer les absences de l'étudiant connecté
   * @param date - Optionnel: filtrer par date
   */
  getMesAbsences(date?: string): Observable<ApiResponse<Absence[]>>;

  /**
   * Récupérer les justifications de l'étudiant connecté
   */
  getMesJustifications(): Observable<ApiResponse<Justification[]>>;

  /**
   * Récupérer les cours de l'étudiant connecté
   */
  getMesCours(dateDebut?: string, dateFin?: string): Observable<ApiResponse<Cours[]>>;

  /**
   * Mettre à jour un étudiant
   * @param id - ID de l'étudiant
   * @param data - Données mises à jour
   */
  update(id: number, data: EtudiantUpdateDto): Observable<ApiResponse<EtudiantListItem>>;

  /**
   * Supprimer un étudiant
   * @param id - ID de l'étudiant
   */
  delete(id: number): Observable<ApiResponse<null>>;

  /**
   * Justifier une absence
   * @param absenceId - ID de l'absence
   * @param date - Date de l'absence
   * @param motif - Motif de la justification
   */
  justifie(absenceId: number, date: string, motif: string): Observable<ApiResponse<unknown>>;
}
