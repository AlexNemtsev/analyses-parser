import { TextResult } from 'pdf-parse';
import { normalizeCharacteristics } from './normalizeCharacteristics';
import { extractDigitCharacteristics } from './extractDigitCharacteristics';
import { extractCommonUrineCharacteristics } from './extractCommonUrineCharacteristics';
import { AnalysesTypes, AnalysesTypesKeys } from './AnalysesTypes';

const parseName = (textArr: string[]) => {
  return textArr[0].split(' ')[1];
};

const parseAnalyzeTypeAndNumber = (textArr: string[]) => {
  const str = textArr[2];
  const lastSpaceIndex = str.lastIndexOf(' ');

  return {
    analyzeType: str.slice(0, lastSpaceIndex),
    analyzeNumber: str.slice(lastSpaceIndex + 2),
  };
};

const getAnalyzeTypeKey = (type: string) => {
  for (const [key, value] of Object.entries(AnalysesTypes)) {
    if (value === type) {
      return key as AnalysesTypesKeys;
    }
  }

  return null;
};

const filterCharacteristics = (textArr: string[]) => {
  const filtered = textArr.slice(3).filter((str) => str && !str.match(/^--|лаборатор|врач/gi));
  return filtered;
};

export const getMainData = (pdfResult: TextResult) => {
  const textArray = pdfResult.text.split('\n');

  const dateIndex = textArray.findIndex((str) => str.startsWith('Дата взятия'));
  const nameIndex = textArray.findIndex((str) => str.startsWith('Кличка'));
  const filtered = textArray.slice(nameIndex);

  const name = parseName(filtered);
  const { analyzeType, analyzeNumber } = parseAnalyzeTypeAndNumber(filtered);
  const analyzeTypeKey = getAnalyzeTypeKey(analyzeType);
  const characteristics = filterCharacteristics(filtered);
  const dateStr = textArray[dateIndex];

  const date = [...dateStr.matchAll(/.*?(\d\d.\d\d.\d\d\d\d)/gi)][0][1]
    .split('.')
    .reverse()
    .join('-');

  const normalizedCharacteristics =
    analyzeTypeKey && normalizeCharacteristics(characteristics, analyzeTypeKey);

  if (!normalizedCharacteristics) {
    return { date, sheetKey: name, analyzeType, values: null };
  }

  let extracted: Record<string, string> | null = null;

  if (analyzeTypeKey === 'COMMON_URINE') {
    extracted = extractCommonUrineCharacteristics(normalizedCharacteristics);
  } else {
    extracted = normalizedCharacteristics && extractDigitCharacteristics(normalizedCharacteristics);
  }

  return { date, sheetKey: name, analyzeType, values: { ['Номер']: analyzeNumber, ...extracted } };
};
