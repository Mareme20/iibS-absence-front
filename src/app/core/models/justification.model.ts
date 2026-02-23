import { Absence } from './absence.model';

export enum StatutJustification {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE'
}

export interface Justification {
  id?: number;
  date: Date | string;
  motif: string;
  statut: StatutJustification;
  absenceId?: number;
  absence?: Absence;
}

export interface JustificationCreateDto {
  absenceId: number;
  date: string;
  motif: string;
}

export interface JustificationTraiterDto {
  statut: StatutJustification;
}

export interface JustificationResponse {
  success: boolean;
  data: Justification | Justification[];
}
