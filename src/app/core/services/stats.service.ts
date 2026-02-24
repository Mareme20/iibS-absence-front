// src/app/core/services/stats.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import {
  CoursParClasseStat,
  CoursParProfesseurStat,
  IStatsService,
  Plus25HeuresStat,
  TopAbsentStat
} from '../interfaces/IStatsService';
import { ApiResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class StatsService implements IStatsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/stats`;

  getCoursParProfesseur(): Observable<ApiResponse<CoursParProfesseurStat[]>> {
    return this.http.get<ApiResponse<CoursParProfesseurStat[]>>(`${this.API_URL}/cours-par-professeur`);
  }

  getCoursParClasse(): Observable<ApiResponse<CoursParClasseStat[]>> {
    return this.http.get<ApiResponse<CoursParClasseStat[]>>(`${this.API_URL}/cours-par-classe`);
  }

  getTop5Absents(): Observable<ApiResponse<TopAbsentStat[]>> {
    return this.http.get<ApiResponse<TopAbsentStat[]>>(`${this.API_URL}/top5-absents`);
  }

  getPlus25Heures(): Observable<ApiResponse<Plus25HeuresStat[]>> {
    return this.http.get<ApiResponse<Plus25HeuresStat[]>>(`${this.API_URL}/plus25-heures`);
  }
}
