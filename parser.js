import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';
import { getMainData, AnalysesTypes } from './src/common.js';
import { extractBioChemBlood } from './src/extractBioChemBlood.js';
import { extractBioChemUrine } from './src/extractBioChemUrine.js';
import { extractCommonUrine } from './src/extractCommonUrine.js';
import { extractCommonBlood } from './src/extractCommonBlood.js';

const buffer = await readFile('Шанель КК.pdf');

const parser = new PDFParse({ data: buffer });

const parsedPDF = await parser.getText();
await parser.destroy();

const { name, analyzeType, characteristics } = getMainData(parsedPDF);

console.log(parsedPDF.text.split('\n'));

console.log(name);
console.log(analyzeType);
console.log(characteristics);

let extracted;

switch (analyzeType.toLowerCase()) {
  case AnalysesTypes.BIO_CHEM_BLOOD:
    extracted = extractBioChemBlood(characteristics);
    break;
  case AnalysesTypes.COMMON_BLOOD:
    extracted = extractCommonBlood(characteristics);
    break;
  case AnalysesTypes.BIO_CHEM_URINE:
    extracted = extractBioChemUrine(characteristics);
    break;
  case AnalysesTypes.COMMON_URINE:
    extracted = extractCommonUrine(parsedPDF);
    break;
  default:
    break;
}

// console.log(Object.fromEntries(extracted), extracted.length);

// https://script.google.com/macros/s/AKfycbwdriT-cErFwqq_bRQfoNeEOoTiHgVfXRyU4YDVrlRCQPbURIxbURN7v3VDoca4wIMX/exec
// AKfycbysrffvGAELpKFsa56XS8mD2q6L07rFlnR9ANcRG93mjZqnT44lmxscnFN2kA92Chyq
