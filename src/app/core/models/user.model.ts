export enum UserRole {
  ADMIN = 'ADMIN',
  PROF = 'PROF',
  ATTACHE = 'ATTACHE',
  RP = 'RP',
  ETUDIANT = 'ETUDIANT'
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: UserRole;
  matricule?: string;
  adresse?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// Propriétés étendues depuis le token JWT
export interface TokenPayload {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
