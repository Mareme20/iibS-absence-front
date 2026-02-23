export interface EtudiantUser {
  nom: string;
  prenom: string;
  email: string;
}

export interface EtudiantListItem {
  id?: number;
  matricule: string;
  adresse: string;
  user?: EtudiantUser;
  nom?: string;
  prenom?: string;
  email?: string;
}

export interface Etudiant {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  matricule?: string;
  adresse: string;
  user?: EtudiantUser;
}

export interface Inscription {
  etudiantId: number;
  classeId: number;
  annee: string;
}

export interface EtudiantCreateDto {
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  adresse: string;
}

export interface EtudiantUpdateDto {
  nom?: string;
  prenom?: string;
  email?: string;
  matricule?: string;
  adresse?: string;
}

export interface EtudiantResponse {
  success: boolean;
  data: Etudiant | Etudiant[] | EtudiantListItem | EtudiantListItem[];
}
