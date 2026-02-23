export interface Classe {
  id?: number;
  libelle: string;
  filiere: string;
  niveau: string;
  // Compatibilité avec d'anciens payloads
  nom?: string;
  filliere?: string;
}

export interface ClasseCreateDto {
  libelle: string;
  filiere: string;
  niveau: string;
}

export interface ClasseUpdateDto {
  libelle?: string;
  filiere?: string;
  niveau?: string;
  // Compatibilité avec d'anciens payloads
  nom?: string;
  filliere?: string;
}

export interface ClasseResponse {
  success: boolean;
  data: Classe | Classe[];
}
