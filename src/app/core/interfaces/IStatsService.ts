import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';

export interface CoursParProfesseurStat {
  nom: string;
  prenom: string;
  nombreCours: number;
}

export interface CoursParClasseStat {
  libelle: string;
  nombreCours: number;
}

export interface TopAbsentStat {
  matricule: string;
  absences: number;
}

export interface Plus25HeuresStat {
  matricule: string;
  totalHeures: number;
}

/**
 * Interface pour le service de statistiques
 * Définit le contrat que tout service de statistiques doit implémenter
 */
export interface IStatsService {
  /**
   * Récupérer les statistiques des cours par professeur
   */
  getCoursParProfesseur(): Observable<ApiResponse<CoursParProfesseurStat[]>>;

  /**
   * Récupérer les statistiques des cours par classe
   */
  getCoursParClasse(): Observable<ApiResponse<CoursParClasseStat[]>>;

  /**
   * Récupérer le top 5 des étudiants les plus absents
   */
  getTop5Absents(): Observable<ApiResponse<TopAbsentStat[]>>;

  /**
   * Récupérer la liste des étudiants ayant plus de 25 heures d'absence
   */
  getPlus25Heures(): Observable<ApiResponse<Plus25HeuresStat[]>>;
}
