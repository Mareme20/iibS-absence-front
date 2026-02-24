// src/app/core/services/justification.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Justification, StatutJustification } from '../models/justification.model';
import { ApiResponse } from '../models/api.model';
import { IJustificationService } from '../interfaces/IJustificationService';

@Injectable({ providedIn: 'root' })
export class JustificationService implements IJustificationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/justifications`;
  private readonly ABSENCE_URL = `${environment.apiUrl}/absences`;

  // Récupérer toutes les justifications
  getAll(): Observable<Justification[]> {
    return this.http.get<ApiResponse<Justification[]>>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  // Récupérer une justification par ID
  getById(id: number): Observable<Justification> {
    return this.http.get<ApiResponse<Justification>>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  // Marquer une absence comme justifiée (pour l'ATTACHE)
  markAbsenceAsJustified(absenceId: number): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.ABSENCE_URL}/${absenceId}/justifier`, {});
  }

  // Traiter une justification (accepter ou rejeter)
  traiter(id: number, statut: StatutJustification): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.API_URL}/${id}/traiter`, { statut });
  }

}
