// src/app/core/services/classe.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Classe } from '../models/classe.model';
import { ApiResponse } from '../models/api.model';
import { IClasseService } from '../interfaces/IClasseService';
import { EtudiantListItem } from '../models/etudiant.model';

@Injectable({ providedIn: 'root' })
export class ClasseService implements IClasseService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/classes`;

  getAll(): Observable<ApiResponse<Classe[]>> {
    return this.http.get<ApiResponse<Classe[]>>(this.API_URL);
  }

  getById(id: number): Observable<ApiResponse<Classe>> {
    return this.http.get<ApiResponse<Classe>>(`${this.API_URL}/${id}`);
  }

  create(classe: Classe): Observable<ApiResponse<Classe>> {
    return this.http.post<ApiResponse<Classe>>(this.API_URL, classe);
  }

  update(id: number, classe: Partial<Classe>): Observable<ApiResponse<Classe>> {
    return this.http.put<ApiResponse<Classe>>(`${this.API_URL}/${id}`, classe);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }

  getEtudiantsByClasse(id: number, annee?: string): Observable<ApiResponse<EtudiantListItem[]>> {
    const params = annee ? { annee } : undefined;
    return this.http.get<ApiResponse<EtudiantListItem[]>>(`${this.API_URL}/${id}/etudiants`, { params });
  }
}
