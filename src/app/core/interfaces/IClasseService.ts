import { Observable } from 'rxjs';
import { Classe } from '../models/classe.model';
import { ApiResponse } from '../models/api.model';
import { EtudiantListItem } from '../models/etudiant.model';

/**
 * Interface pour le service de classes
 * Définit le contrat que tout service de classes doit implémenter
 */
export interface IClasseService {
  /**
   * Récupérer toutes les classes
   */
  getAll(): Observable<ApiResponse<Classe[]>>;

  /**
   * Récupérer une classe par son ID
   * @param id - ID de la classe
   */
  getById(id: number): Observable<ApiResponse<Classe>>;

  /**
   * Créer une nouvelle classe
   * @param classe - Données de la classe
   */
  create(classe: Classe): Observable<ApiResponse<Classe>>;

  /**
   * Mettre à jour une classe
   * @param id - ID de la classe
   * @param classe - Données mises à jour
   */
  update(id: number, classe: Partial<Classe>): Observable<ApiResponse<Classe>>;

  /**
   * Supprimer une classe
   * @param id - ID de la classe
   */
  delete(id: number): Observable<ApiResponse<null>>;

  /**
   * Lister les étudiants inscrits dans une classe
   * @param id - ID de la classe
   * @param annee - Année académique (optionnelle, format YYYY-YYYY)
   */
  getEtudiantsByClasse(id: number, annee?: string): Observable<ApiResponse<EtudiantListItem[]>>;
}
