import { AnalysesTypesKeys } from './AnalysesTypes';
import { commonUrineCharacteristics } from './commonUrineCharacteristics';

const ShortIndicatorsNames: Record<AnalysesTypesKeys, string[]> = {
  BIO_CHEM_BLOOD: [
    'Билирубин общий',
    'Билирубин прямой',
    'АСТ',
    'АЛТ',
    'Коэф. Ритиса',
    'Мочевина ',
    'Креатинин',
    'Соотношение',
    'Общий белок',
    'Альбумин',
    'Глобулин',
    'Альбумин/глобулин',
    'Щелочная фосфатаза',
    'а-Амилаза',
    'Глюкоза',
    'ЛДГ',
    'Калий',
    'Натрий',
    'Натрий/Калий',
    'Фосфор',
    'Ионизированный кальций',
  ],
  BIO_CHEM_URINE: ['Креатинин мочи', 'Белок мочи', 'Соотношение Белок/Креатинин'],
  COMMON_BLOOD: [
    'Гематокрит(Ht,PCV)',
    'Гемоглобин (Hb)',
    'Эритроциты (RBC)',
    'Среднее содержание Hb ',
    'Средняя концентрация Hb в',
    'Средний объём эритроцита',
    'Показатель анизоцитоза',
    'Ядерные эритроциты',
    'СОЭ',
    'Лейкоциты (WBC)',
    'Палочкоядерные нейтрофилы',
    'Сегментоядерные нейтрофилы',
    'Эозинофилы',
    'Моноциты',
    'Базофилы',
    'Лимфоциты',
    'Тромбоциты',
    'Скорректированные истинные',
    'Палочкоядерные нейтрофилы',
    'Сегментоядерные нейтрофилы',
    'Эозинофилы ABS',
    'Моноциты ABS',
    'Базофилы ABS',
    'Лимфоциты ABS',
  ],
  COMMON_URINE: Object.keys(commonUrineCharacteristics),
};

export const normalizeCharacteristics = (
  characteristics: string[],
  analyzeType: AnalysesTypesKeys
) => {
  const normalized: string[] = [];

  characteristics.forEach((str) => {
    const isIndicator = ShortIndicatorsNames[analyzeType].find((ind) => str.startsWith(ind));

    if (isIndicator) {
      normalized.push(str);
    } else {
      const lastStrIndex = normalized.length - 1;
      normalized[lastStrIndex] = `${normalized[lastStrIndex] ?? ''} ${str}`;
    }
  });

  return normalized;
};
