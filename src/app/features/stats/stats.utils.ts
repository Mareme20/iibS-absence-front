import {
  CoursParClasseStat,
  CoursParProfesseurStat,
  Plus25HeuresStat,
  TopAbsentStat
} from '../../core/interfaces/IStatsService';

export function toNumber(value: unknown): number {
  return Number(value || 0);
}

export function getTopAbsentLabel(item: TopAbsentStat): string {
  const fullName = `${item?.prenom || ''} ${item?.nom || ''}`.trim();
  return fullName || item?.matricule || 'N/A';
}

export function getPlus25Label(item: Plus25HeuresStat): string {
  const fullName = `${item?.prenom || ''} ${item?.nom || ''}`.trim();
  return fullName || item?.matricule || 'N/A';
}

export function getRelativeWidth(current: number, values: number[]): number {
  const max = Math.max(...values, 1);
  return (current / max) * 100;
}

export function getClasseColor(index: number): string {
  const palette = ['#1f77b4', '#2ca58d', '#ff9f1c', '#ef476f', '#7353ba', '#06d6a0', '#118ab2'];
  return palette[index % palette.length];
}

export function getClasseTotal(items: CoursParClasseStat[]): number {
  return items.reduce((sum, item) => sum + toNumber(item?.nombreCours), 0);
}

export function getClasseDonutBackground(items: CoursParClasseStat[]): string {
  const total = getClasseTotal(items);
  if (!total) return '#e6edf3';

  let start = 0;
  const segments = items
    .map((item, i) => {
      const size = (toNumber(item?.nombreCours) / total) * 360;
      const color = getClasseColor(i);
      const seg = `${color} ${start}deg ${start + size}deg`;
      start += size;
      return seg;
    })
    .join(', ');

  return `conic-gradient(${segments})`;
}

export function getProfCoursValue(item: CoursParProfesseurStat): number {
  return toNumber(item?.nombreCours);
}

export function getAbsencesValue(item: TopAbsentStat): number {
  return toNumber(item?.absences);
}

export function getHeuresValue(item: Plus25HeuresStat): number {
  return toNumber(item?.totalHeures);
}

