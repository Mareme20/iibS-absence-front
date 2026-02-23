import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionFacade } from '../../../application/facades/session.facade';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  sessionFacade = inject(SessionFacade);
  // Récupération de l'utilisateur pour afficher le menu selon le rôle
  user$ = this.sessionFacade.user$;
  @ViewChild('drawer') drawer!: MatSidenav;
  isMobile = false;

  constructor() {
    this.updateViewportMode();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateViewportMode();
  }

  private updateViewportMode() {
    this.isMobile = window.innerWidth <= 992;
  }

  toggleSidebar() {
    this.drawer?.toggle();
  }

  onNavClick() {
    if (this.isMobile) {
      this.drawer?.close();
    }
  }

  logout() {
    this.sessionFacade.logout();
  }
}
