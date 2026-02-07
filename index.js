import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import {
  extractCharacteristics,
  filterCharacteristics,
  parseAnalyzeType,
  parseName,
} from './parser.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // хранение файла в памяти

// POST /ingest
app.post('/ingest', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Буфер PDF
    const pdfBuffer = req.file.buffer;

    // Метаданные файла
    const fileInfo = {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: pdfBuffer,
    };

    console.log('Получен файл:', fileInfo.originalName, fileInfo.mimetype, fileInfo.size, 'bytes');

    const parser = new PDFParse({ data: pdfBuffer });

    const result = await parser.getText();
    await parser.destroy();

    const textArray = result.text.split('\n');
    const nameIndex = textArray.findIndex((str) => str.startsWith('Кличка'));
    const filtered = textArray.slice(nameIndex);

    const characteristics = filterCharacteristics(filtered);
    const extracted = extractCharacteristics(characteristics);

    console.log(parseName(filtered));
    console.log(parseAnalyzeType(filtered));

    console.log(Object.fromEntries(extracted), extracted.length);

    // --- здесь можно передавать в парсер ---
    // const parsedData = await parsePdf(pdfBuffer);

    res.json({ status: 'ok', file: fileInfo.originalName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Node.js сервер слушает http://localhost:3000');
});
