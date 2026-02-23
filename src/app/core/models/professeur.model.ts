export interface ProfesseurUser {
  nom: string;
  prenom: string;
  email: string;
}

export interface Professeur {
  id?: number;
  specialite: string;
  grade: string;
  user?: ProfesseurUser;
}

export interface ProfesseurCreateDto {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  specialite: string;
  grade: string;
}
