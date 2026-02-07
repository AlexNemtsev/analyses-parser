/**
 *
 * @param {string[]} textArr
 * @returns string
 */
const parseName = (textArr) => {
  return textArr[0].split(' ')[1];
};

/**
 *
 * @param {string[]} textArr
 * @returns string
 */
const parseAnalyzeType = (textArr) => {
  const str = textArr[2];
  const lastSpaceIndex = str.lastIndexOf(' ');

  return str.slice(0, lastSpaceIndex);
};

/**
 *
 * @param {string[]} textArr
 * @returns string
 */
const filterCharacteristics = (textArr) => {
  const filtered = textArr
    .slice(3)
    .filter((str) => str.match(/\d/gi) && !str.match(/лаборатор/gi) && !str.match(/^--/));
  return filtered;
};

/**
 * Извлекает основные данные из результата PDF: кличка, тип анализа и характеристики.
 *
 * @param {Object} pdfResult - Объект, содержащий текст извлеченного PDF.
 * @param {string} pdfResult.text - Текст, извлеченный из PDF, разделённый переносами строк.
 * @returns {Object} Объект с полями:
 * @returns {string} returns.name - кличка, извлечённое из первой строки.
 * @returns {string} returns.analyzeType - Тип анализа, извлечённый из третьей строки.
 * @returns {string[]} returns.characteristics - Массив строк с характеристиками анализа (фильтрованный).
 */
export const getMainData = (pdfResult) => {
  const textArray = pdfResult.text.split('\n');
  const nameIndex = textArray.findIndex((str) => str.startsWith('Кличка'));
  const filtered = textArray.slice(nameIndex);
  // console.log(filtered);

  const name = parseName(filtered);
  const analyzeType = parseAnalyzeType(filtered);
  const characteristics = filterCharacteristics(filtered);

  return { name, analyzeType, characteristics };
};

export const AnalysesTypes = {
  COMMON_BLOOD: 'клинический анализ крови',
  BIO_CHEM_BLOOD: 'биохимический анализ крови',
  COMMON_URINE: 'клинический анализ мочи',
  BIO_CHEM_URINE: 'биохимический анализ мочи',
};
