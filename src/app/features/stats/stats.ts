import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StatsService } from '../../core/services/stats.service';
import {
  CoursParClasseStat,
  CoursParProfesseurStat,
  Plus25HeuresStat,
  TopAbsentStat
} from '../../core/interfaces/IStatsService';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import * as statsUtils from './stats.utils';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    EmptyStateComponent
  ],
  template: `
    <div class="stats-container">
      <h1>Tableau de Bord Statistiques</h1>
      
      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="stats-grid">
        <!-- Cours par Professeur -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>Cours par Professeur</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-block" *ngIf="coursParProfesseur.length > 0">
              <div class="chart-title">Charge d'enseignement par professeur</div>
              <div class="bar-chart">
                <div class="bar-row" *ngFor="let p of coursParProfesseur">
                  <div class="bar-label">{{ p.prenom }} {{ p.nom }}</div>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-prof" [style.width.%]="getProfCoursWidth(p)">
                      <span class="bar-value">{{ getProfCoursValue(p) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table mat-table [dataSource]="coursParProfesseur" class="full-width">
              <ng-container matColumnDef="professeur">
                <th mat-header-cell *matHeaderCellDef>Professeur</th>
                <td mat-cell *matCellDef="let p">{{p.prenom}} {{p.nom}}</td>
              </ng-container>
              <ng-container matColumnDef="nombreCours">
                <th mat-header-cell *matHeaderCellDef>Nombre de Cours</th>
                <td mat-cell *matCellDef="let p">{{p.nombreCours}}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['professeur', 'nombreCours']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['professeur', 'nombreCours'];"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Cours par Classe -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>class</mat-icon>
            <mat-card-title>Cours par Classe</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-block" *ngIf="coursParClasse.length > 0">
              <div class="chart-title">Répartition des cours</div>
              <div class="donut-wrap">
                <div class="donut" [style.background]="getClasseDonutBackground()">
                  <div class="donut-hole">
                    <strong>{{ getClasseTotal() }}</strong>
                    <span>cours</span>
                  </div>
                </div>
                <div class="donut-legend">
                  <div class="legend-item" *ngFor="let c of coursParClasse; let i = index">
                    <span class="legend-dot" [style.background]="getClasseColor(i)"></span>
                    <span class="legend-text">{{ c.libelle }}</span>
                    <strong>{{ getClasseValue(c) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <table mat-table [dataSource]="coursParClasse" class="full-width">
              <ng-container matColumnDef="classe">
                <th mat-header-cell *matHeaderCellDef>Classe</th>
                <td mat-cell *matCellDef="let c">{{c.libelle}}</td>
              </ng-container>
              <ng-container matColumnDef="nombreCours">
                <th mat-header-cell *matHeaderCellDef>Nombre de Cours</th>
                <td mat-cell *matCellDef="let c">{{c.nombreCours}}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['classe', 'nombreCours']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['classe', 'nombreCours'];"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Top 5 Absents -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>warning</mat-icon>
            <mat-card-title>Top 5 Absents</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-block" *ngIf="top5Absents.length > 0">
              <div class="chart-title">Diagramme des absences non justifiées</div>
              <div class="bar-chart">
                <div class="bar-row" *ngFor="let e of top5Absents">
                  <div class="bar-label">{{ getTopAbsentLabel(e) }}</div>
                  <div class="bar-track">
                    <div class="bar-fill" [style.width.%]="getAbsencesWidth(e)">
                      <span class="bar-value">{{ getAbsencesValue(e) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table mat-table [dataSource]="top5Absents" class="full-width">
              <ng-container matColumnDef="etudiant">
                <th mat-header-cell *matHeaderCellDef>Étudiant</th>
                <td mat-cell *matCellDef="let e">{{ getTopAbsentLabel(e) }}</td>
              </ng-container>
              <ng-container matColumnDef="nombreAbsences">
                <th mat-header-cell *matHeaderCellDef>Nombre d'Absences</th>
                <td mat-cell *matCellDef="let e">{{e.absences}}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['etudiant', 'nombreAbsences']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['etudiant', 'nombreAbsences'];"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Plus de 25 heures -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>error</mat-icon>
            <mat-card-title>Étudiants > 25h d'Absence</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-block" *ngIf="plus25Heures.length > 0">
              <div class="chart-title">Heures d'absences cumulées</div>
              <div class="bar-chart">
                <div class="bar-row" *ngFor="let e of plus25Heures">
                  <div class="bar-label">{{ getPlus25Label(e) }}</div>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-risk" [style.width.%]="getHeuresWidth(e)">
                      <span class="bar-value">{{ getHeuresValue(e) }}h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table mat-table [dataSource]="plus25Heures" class="full-width">
              <ng-container matColumnDef="etudiant">
                <th mat-header-cell *matHeaderCellDef>Étudiant</th>
                <td mat-cell *matCellDef="let e">{{ getPlus25Label(e) }}</td>
              </ng-container>
              <ng-container matColumnDef="totalHeures">
                <th mat-header-cell *matHeaderCellDef>Heures Totales</th>
                <td mat-cell *matCellDef="let e">{{e.totalHeures}}h</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['etudiant', 'totalHeures']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['etudiant', 'totalHeures'];"></tr>
            </table>
            <app-empty-state
              *ngIf="plus25Heures.length === 0"
              icon="check_circle"
              message="Aucun étudiant n'a dépassé 25h d'absence"
              color="#4caf50" />
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-container { padding: 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .stat-card { padding: 16px; }
    .full-width { width: 100%; }
    .chart-block {
      margin-bottom: 16px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #f7f9fb;
      border: 1px solid #e7edf2;
    }
    .chart-title {
      margin-bottom: 10px;
      font-weight: 600;
      color: #2d404c;
      font-size: 0.92rem;
    }
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bar-row {
      display: grid;
      grid-template-columns: 90px 1fr;
      align-items: center;
      gap: 10px;
    }
    .bar-label {
      font-size: 0.85rem;
      color: #3f535f;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-track {
      height: 26px;
      background: #e7edf2;
      border-radius: 999px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #1976d2, #26a69a);
      border-radius: 999px;
      min-width: 34px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      transition: width 0.4s ease;
    }
    .bar-value {
      font-size: 0.78rem;
      color: #fff;
      font-weight: 700;
    }
    .bar-fill-prof {
      background: linear-gradient(90deg, #3567d6, #4f8dff);
    }
    .bar-fill-risk {
      background: linear-gradient(90deg, #ef5350, #f57c00);
    }
    .donut-wrap {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 14px;
      align-items: center;
    }
    .donut {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      margin: 0 auto;
      box-shadow: inset 0 0 0 1px rgba(30, 40, 60, 0.05);
    }
    .donut-hole {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #304452;
      border: 1px solid #edf2f6;
    }
    .donut-hole strong {
      font-size: 1.1rem;
      line-height: 1;
    }
    .donut-hole span {
      font-size: 0.75rem;
      color: #607380;
      margin-top: 2px;
    }
    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }
    .legend-item {
      display: grid;
      grid-template-columns: 10px 1fr auto;
      align-items: center;
      gap: 8px;
      font-size: 0.84rem;
      color: #425764;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .legend-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 520px) {
      .donut-wrap {
        grid-template-columns: 1fr;
      }
    }
    .loading { display: flex; justify-content: center; padding: 50px; }
  `]
})
export class StatsComponent implements OnInit {
  private statsService = inject(StatsService);

  loading = true;
  coursParProfesseur: CoursParProfesseurStat[] = [];
  coursParClasse: CoursParClasseStat[] = [];
  top5Absents: TopAbsentStat[] = [];
  plus25Heures: Plus25HeuresStat[] = [];

  ngOnInit() {
    this.loadAllStats();
  }

  loadAllStats() {
    this.loading = true;
    forkJoin({
      coursParProfesseur: this.statsService.getCoursParProfesseur().pipe(catchError(() => of({ data: [] }))),
      coursParClasse: this.statsService.getCoursParClasse().pipe(catchError(() => of({ data: [] }))),
      top5Absents: this.statsService.getTop5Absents().pipe(catchError(() => of({ data: [] }))),
      plus25Heures: this.statsService.getPlus25Heures().pipe(catchError(() => of({ data: [] })))
    }).subscribe({
      next: (result) => {
        this.coursParProfesseur = result.coursParProfesseur.data || [];
        this.coursParClasse = result.coursParClasse.data || [];
        this.top5Absents = result.top5Absents.data || [];
        this.plus25Heures = result.plus25Heures.data || [];
        this.loading = false;
      },
      error: () => {
        this.coursParProfesseur = [];
        this.coursParClasse = [];
        this.top5Absents = [];
        this.plus25Heures = [];
        this.loading = false;
      }
    });
  }

  getAbsencesValue(item: TopAbsentStat): number {
    return statsUtils.getAbsencesValue(item);
  }

  getTopAbsentLabel(item: TopAbsentStat): string {
    return statsUtils.getTopAbsentLabel(item);
  }

  getAbsencesWidth(item: TopAbsentStat): number {
    const current = this.getAbsencesValue(item);
    return statsUtils.getRelativeWidth(current, this.top5Absents.map((x) => this.getAbsencesValue(x)));
  }

  getProfCoursValue(item: CoursParProfesseurStat): number {
    return statsUtils.getProfCoursValue(item);
  }

  getProfCoursWidth(item: CoursParProfesseurStat): number {
    const current = this.getProfCoursValue(item);
    return statsUtils.getRelativeWidth(current, this.coursParProfesseur.map((x) => this.getProfCoursValue(x)));
  }

  getClasseValue(item: CoursParClasseStat): number {
    return statsUtils.toNumber(item?.nombreCours);
  }

  getClasseTotal(): number {
    return statsUtils.getClasseTotal(this.coursParClasse);
  }

  getClasseColor(index: number): string {
    return statsUtils.getClasseColor(index);
  }

  getClasseDonutBackground(): string {
    return statsUtils.getClasseDonutBackground(this.coursParClasse);
  }

  getHeuresValue(item: Plus25HeuresStat): number {
    return statsUtils.getHeuresValue(item);
  }

  getPlus25Label(item: Plus25HeuresStat): string {
    return statsUtils.getPlus25Label(item);
  }

  getHeuresWidth(item: Plus25HeuresStat): number {
    const current = this.getHeuresValue(item);
    return statsUtils.getRelativeWidth(current, this.plus25Heures.map((x) => this.getHeuresValue(x)));
  }
}
