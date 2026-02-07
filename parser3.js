// parse.mjs
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

async function parsePdf(filename) {
  const buffer = await readFile(filename);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    console.log(result.text);
    return result.text;
  } finally {
    await parser.destroy(); // важно для предотвращения утечек памяти
  }
}

// Запуск
const text = await parsePdf('Ириска КМ.pdf');
