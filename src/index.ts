import express from 'express';
import multer from 'multer';

import { getMainData } from './getMainData';
import { parsePdf } from './parsePdf';

const GAS_TOKEN = process.env.GAS_TOKEN;
const INGEST_TOKEN = process.env.INGEST_TOKEN;
const GAS_URL = process.env.GAS_URL;
const PORT = process.env.PORT || 3000;

if (!GAS_URL) {
  throw new Error('GAS_URL is not defined');
}

if (!GAS_TOKEN) {
  throw new Error('TOKEN is not defined');
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/ingest', upload.single('file'), async (req, res) => {
  const authHeader = req.headers.authorization;
  const tokenFromBody = req.body?.token;

  if (authHeader !== `Bearer ${INGEST_TOKEN}` && tokenFromBody !== INGEST_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: invalid token' });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const pdfBuffer = req.file.buffer;

    const fileInfo = {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: pdfBuffer,
    };

    console.log('Получен файл:', fileInfo.originalName, fileInfo.mimetype, fileInfo.size, 'bytes');

    const parsedPdf = await parsePdf(pdfBuffer);
    const pdfData = getMainData(parsedPdf);
    const body = JSON.stringify({ ...pdfData, token: GAS_TOKEN });

    const response = await fetch(GAS_URL, {
      method: 'POST',
      body,
    });

    const responseBody = await response.json();

    if (response.ok) {
      res.json({
        status: 'ok',
        file: fileInfo.originalName,
        gasResponse: JSON.stringify(responseBody),
      });
    } else {
      res.status(500).json({ error: 'Ошибка отправки данных в таблицу' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js сервер слушает port:${PORT}`);
});
