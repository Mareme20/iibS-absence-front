import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/user.model';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { IAuthService } from '../interfaces/IAuthService';

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = this.tokenService.getToken();
    if (token) {
      const user = this.getUserFromToken(token);
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        this.logout(); // Token invalide ou corrompu
      }
    }
  }

   private getUserFromToken(token: string): User | null {
    try {
      // On prend la DEUXIÈME partie du token (le payload)
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Décodage UTF-8 pour gérer les accents (Marieme, etc.)
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      
      return {
        id: decoded.id,
        role: decoded.role,
        prenom: decoded.prenom || 'Utilisateur',
        email: decoded.email
      } as User;
    } catch (e) {
      console.error('Erreur décodage token:', e);
      return null;
    }
  }


  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        // Le backend renvoie { success: true, data: { token, user } }
        // Vérifie bien que ton contrôleur encapsule dans "data"
        const authData = res.data; 
        if (authData && authData.token) {
          this.tokenService.setToken(authData.token);
          const user = this.getUserFromToken(authData.token);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(payload: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, payload);
  }

  logout() {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  /**
   * Retourne le token JWT depuis le TokenService
   */
  getToken(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * Retourne l'utilisateur courant depuis le BehaviorSubject
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Retourne l'ID de l'utilisateur depuis le token
   */
  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  /**
   * Retourne le rôle de l'utilisateur depuis le token
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  get isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Vérifie si l'utilisateur est un professeur
   */
  get isProfesseur(): boolean {
    return this.hasRole('PROF');
  }

  /**
   * Vérifie si l'utilisateur est un attaché
   */
  get isAttaché(): boolean {
    return this.hasRole('ATTACHE');
  }

  /**
   * Vérifie si l'utilisateur est un étudiant
   */
  get isEtudiant(): boolean {
    return this.hasRole('ETUDIANT');
  }
}
