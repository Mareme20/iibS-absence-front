import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Etudiant, EtudiantListItem, EtudiantUpdateDto, Inscription } from '../models/etudiant.model';
import { Absence } from '../models/absence.model';
import { Justification } from '../models/justification.model';
import { ApiResponse } from '../models/api.model';
import { IEtudiantService } from '../interfaces/IEtudiantService';

@Injectable({ providedIn: 'root' })
export class EtudiantService implements IEtudiantService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/etudiants`;

  create(etudiant: Etudiant): Observable<ApiResponse<Etudiant>> {
    return this.http.post<ApiResponse<Etudiant>>(this.API_URL, etudiant);
  }

  getAll(): Observable<ApiResponse<EtudiantListItem[]>> {
    return this.http.get<ApiResponse<EtudiantListItem[]>>(this.API_URL);
  }

  getById(id: number): Observable<ApiResponse<EtudiantListItem>> {
    return this.http.get<ApiResponse<EtudiantListItem>>(`${this.API_URL}/${id}`);
  }

  inscription(data: Inscription): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.API_URL}/inscription`, data);
  }

  getMesAbsences(date?: string): Observable<ApiResponse<Absence[]>> {
    const url = date ? `${this.API_URL}/mes-absences?date=${date}` : `${this.API_URL}/mes-absences`;
    return this.http.get<ApiResponse<Absence[]>>(url);
  }

  getMesJustifications(): Observable<ApiResponse<Justification[]>> {
    return this.http.get<ApiResponse<Justification[]>>(`${this.API_URL}/mes-justifications`);
  }

  update(id: number, data: EtudiantUpdateDto): Observable<ApiResponse<EtudiantListItem>> {
    return this.http.put<ApiResponse<EtudiantListItem>>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }

  justifie(absenceId: number, date: string, motif: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.API_URL}/justifier`, { absenceId, date, motif });
  }
}
