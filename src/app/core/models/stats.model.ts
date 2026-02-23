export interface Stats {
  totalAbsences: number;
  absencesJustifiees: number;
  absencesNonJustifiees: number;
  totalEtudiants: number;
  totalCours: number;
  tauxAbsence: number;
}

export interface StatsParMois {
  mois: string;
  nombreAbsences: number;
}

export interface StatsParEtudiant {
  etudiantId: number;
  etudiantNom: string;
  etudiantPrenom: string;
  nombreAbsences: number;
}

export interface StatsResponse {
  success: boolean;
  data: Stats | StatsParMois[] | StatsParEtudiant[];
}
