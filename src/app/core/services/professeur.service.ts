// src/app/core/services/professeur.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { IProfesseurService } from '../interfaces/IProfesseurService';
import { Professeur, ProfesseurCreateDto } from '../models/professeur.model';

@Injectable({ providedIn: 'root' })
export class ProfesseurService implements IProfesseurService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/professeurs`;

  create(professeur: ProfesseurCreateDto): Observable<ApiResponse<Professeur>> {
    return this.http.post<ApiResponse<Professeur>>(this.API_URL, professeur);
  }

  getAll(): Observable<ApiResponse<Professeur[]>> {
    return this.http.get<ApiResponse<Professeur[]>>(this.API_URL);
  }
}
