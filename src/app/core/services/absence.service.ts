// src/app/core/services/absence.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable, map } from 'rxjs';
import { Absence, AbsenceCreateDto, AbsenceUpdateDto } from '../models/absence.model';
import { Justification } from '../models/justification.model';
import { ApiResponse } from '../models/api.model';
import { IAbsenceService } from '../interfaces/IAbsenceService';
// Service pour gérer les absences et justifications
@Injectable({ providedIn: 'root' })
export class AbsenceService implements IAbsenceService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/absences`;
  private readonly ETUDIANT_URL = `${environment.apiUrl}/etudiants`;

  // Pour les étudiants - voir leurs absences
  getMesAbsences(date?: string): Observable<Absence[]> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ApiResponse<Absence[]>>(`${this.ETUDIANT_URL}/mes-absences`, { params }).pipe(
      map(res => res.data)
    );
  }

  // Pour les étudiants - voir leurs justifications
  getMesJustifications(statut?: string): Observable<Justification[]> {
    let params = new HttpParams();
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<ApiResponse<Justification[]>>(`${this.ETUDIANT_URL}/mes-justifications`, { params }).pipe(
      map(res => res.data)
    );
  }

  // Pour les PROF - enregistrer une absence
  create(absence: AbsenceCreateDto): Observable<ApiResponse<Absence>> {
    return this.http.post<ApiResponse<Absence>>(this.API_URL, absence);
  }

  // Liste de toutes les absences
  getAll(): Observable<Absence[]> {
    return this.http.get<ApiResponse<Absence[]>>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  // Récupérer une absence par ID
  getById(id: number): Observable<Absence> {
    return this.http.get<ApiResponse<Absence>>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  // Mettre à jour une absence
  update(id: number, absence: AbsenceUpdateDto): Observable<ApiResponse<Absence>> {
    return this.http.put<ApiResponse<Absence>>(`${this.API_URL}/${id}`, absence);
  }

  // Supprimer une absence
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }

  // Pour les étudiants - soumettre une justification
  justify(justification: Justification): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.ETUDIANT_URL}/justifier`, justification);
  }

  // Marquer une absence comme justifiée
  markAsJustified(absenceId: number): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.API_URL}/${absenceId}/justifier`, {});
  }
}
