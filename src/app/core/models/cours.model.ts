import { User } from './user.model';
import { Classe } from './classe.model';

export interface Cours {
  id?: number;
  date: Date | string;
  heureDebut: string;
  heureFin: string;
  semestre: string;
  module: string;
  professeur?: User;
  professeurId?: number;
  classes?: Classe[];
  classeIds?: number[];
}

export interface CoursCreateDto {
  module: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  semestre: string;
  professeurId: number;
  classeIds: number[];
}

export interface CoursUpdateDto {
  module?: string;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  semestre?: string;
  professeurId?: number;
  classeIds?: number[];
}

export interface CoursResponse {
  success: boolean;
  data: Cours | Cours[];
}
