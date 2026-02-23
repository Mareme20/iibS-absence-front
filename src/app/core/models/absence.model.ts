import { EtudiantListItem } from './etudiant.model';
import { Cours } from './cours.model';
import { Justification } from './justification.model';

export interface Absence {
  id?: number;
  date: Date | string;
  nombreHeures: number;
  estJustifiee: boolean;
  etudiant?: EtudiantListItem;
  etudiantId?: number;
  cours?: Cours;
  coursId?: number;
  justification?: Justification;
}

export interface AbsenceCreateDto {
  etudiantId: number;
  coursId: number;
  date: string;
  nombreHeures: number;
}

export interface AbsenceUpdateDto {
  date?: string;
  nombreHeures?: number;
  estJustifiee?: boolean;
}

export interface AbsenceResponse {
  success: boolean;
  data: Absence | Absence[];
}
