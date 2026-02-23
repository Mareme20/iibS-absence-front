import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Injectable({ providedIn: 'root' })
export class SessionFacade {
  private authService = inject(AuthService);

  readonly user$ = this.authService.currentUser$;

  logout() {
    this.authService.logout();
  }
}
