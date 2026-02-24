import { Injectable, signal, computed } from '@angular/core';
import { ITokenService } from '../interfaces/ITokenService';

/**
 * Service pour gérer le token JWT via Angular DI
 * Ce service permet d'injecter le token dans les services sans accéder directement au localStorage
 */
@Injectable({ providedIn: 'root' })
export class TokenService implements ITokenService {
  // Signal pour stocker le token
  private _token = signal<string | null>(this.getTokenFromStorage());
  //
  // Computed signal pour obtenir le token
  readonly token = computed(() => this._token());
  
  // Computed signal pour vérifier si l'utilisateur est connecté
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    // Écouter les changements de localStorage (pour les onglets multiples)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'token') {
          this._token.set(event.newValue);
        }
      });
    }
  }

  /**
   * Récupérer le token depuis le localStorage
   */
  private getTokenFromStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Définir le token
   * @param token - Le token JWT
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this._token.set(token);
  }

  /**
   * Supprimer le token
   */
  removeToken(): void {
    localStorage.removeItem('token');
    this._token.set(null);
  }

  /**
   * Obtenir le token (alias pour computed signal)
   */
  getToken(): string | null {
    return this._token();
  }
}
