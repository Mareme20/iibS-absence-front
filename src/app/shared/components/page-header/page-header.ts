import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatCardHeader, MatCardTitle, MatCardSubtitle],
  template: `
    <mat-card-header>
      <mat-card-title>{{ title }}</mat-card-title>
      <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
    </mat-card-header>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
