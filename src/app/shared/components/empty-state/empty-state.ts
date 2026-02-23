import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state" [style.color]="color">
      <mat-icon>{{ icon }}</mat-icon>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 32px;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      display: block;
      margin: 0 auto 8px;
    }
    .empty-state p {
      margin: 0;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'info';
  @Input({ required: true }) message!: string;
  @Input() color = '#666';
}
