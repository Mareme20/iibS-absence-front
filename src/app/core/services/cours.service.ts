// src/app/core/services/cours.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Cours } from '../models/cours.model';
import { ApiResponse } from '../models/api.model';
import { ICoursService } from '../interfaces/ICoursService';

@Injectable({ providedIn: 'root' })
export class CoursService implements ICoursService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/cours`;

  getAll(heureDebut?: string, heureFin?: string): Observable<ApiResponse<Cours[]>> {
    let params = {};
    if (heureDebut) {
      params = { ...params, heureDebut };
    }
    if (heureFin) {
      params = { ...params, heureFin };
    }
    return this.http.get<ApiResponse<Cours[]>>(this.API_URL, { params });
  }

  getMesCours(dateDebut?: string, dateFin?: string): Observable<ApiResponse<Cours[]>> {
    let params = {};
    if (dateDebut && dateFin) {
      params = { dateDebut, dateFin };
    }
    return this.http.get<ApiResponse<Cours[]>>(`${this.API_URL}/mes-cours`, { params });
  }

  getById(id: number): Observable<ApiResponse<Cours>> {
    return this.http.get<ApiResponse<Cours>>(`${this.API_URL}/${id}`);
  }

  create(cours: Cours): Observable<ApiResponse<Cours>> {
    return this.http.post<ApiResponse<Cours>>(this.API_URL, cours);
  }

  update(id: number, cours: Partial<Cours>): Observable<ApiResponse<Cours>> {
    return this.http.put<ApiResponse<Cours>>(`${this.API_URL}/${id}`, cours);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }
}
