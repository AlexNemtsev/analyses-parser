export const AnalysesTypes = {
  COMMON_BLOOD: 'Клинический анализ крови',
  BIO_CHEM_BLOOD: 'Биохимический анализ крови',
  COMMON_URINE: 'Клинический анализ мочи',
  BIO_CHEM_URINE: 'Биохимический анализ мочи',
} as const;

export type AnalysesTypesKeys = keyof typeof AnalysesTypes;
