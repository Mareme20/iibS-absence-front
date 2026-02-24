import { describe, expect, it } from 'vitest';
import {
  getClasseDonutBackground,
  getClasseTotal,
  getPlus25Label,
  getRelativeWidth,
  getTopAbsentLabel
} from './stats.utils';

describe('stats.utils', () => {
  it('returns full name for top absent label', () => {
    expect(getTopAbsentLabel({ prenom: 'Awa', nom: 'Sarr', absences: 5 })).toBe('Awa Sarr');
  });

  it('falls back to matricule when names are missing', () => {
    expect(getTopAbsentLabel({ matricule: 'ETU001', absences: 2 })).toBe('ETU001');
    expect(getPlus25Label({ matricule: 'ETU002', totalHeures: 30 })).toBe('ETU002');
  });

  it('computes relative width against max', () => {
    expect(getRelativeWidth(5, [5, 10])).toBe(50);
    expect(getRelativeWidth(0, [])).toBe(0);
  });

  it('computes class totals and donut background', () => {
    const items = [
      { libelle: 'L1', nombreCours: 2 },
      { libelle: 'L2', nombreCours: 3 }
    ];
    expect(getClasseTotal(items)).toBe(5);
    const background = getClasseDonutBackground(items);
    expect(background.startsWith('conic-gradient(')).toBe(true);
  });
});

