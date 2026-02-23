import { Observable } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/user.model';

/**
 * Interface pour le service d'authentification
 * Définit le contrat que tout service d'authentification doit implémenter
 */
export interface IAuthService {
  /**
   * Observable de l'utilisateur courant
   */
  currentUser$: Observable<User | null>;

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn: boolean;

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  isAdmin: boolean;

  /**
   * Vérifie si l'utilisateur est un professeur
   */
  isProfesseur: boolean;

  /**
   * Vérifie si l'utilisateur est un attaché
   */
  isAttaché: boolean;

  /**
   * Vérifie si l'utilisateur est un étudiant
   */
  isEtudiant: boolean;

  /**
   * Connecter un utilisateur
   * @param credentials - Identifiants de connexion
   */
  login(credentials: LoginDto): Observable<AuthResponse>;

  /**
   * Inscrire un utilisateur
   * @param payload - Données d'inscription
   */
  register(payload: RegisterDto): Observable<User>;

  /**
   * Déconnecter l'utilisateur
   */
  logout(): void;

  /**
   * Récupérer le token JWT
   */
  getToken(): string | null;

  /**
   * Récupérer l'utilisateur courant
   */
  getCurrentUser(): User | null;

  /**
   * Récupérer l'ID de l'utilisateur
   */
  getUserId(): number | null;

  /**
   * Récupérer le rôle de l'utilisateur
   */
  getUserRole(): string | null;

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param role - Rôle à vérifier
   */
  hasRole(role: string): boolean;
}
