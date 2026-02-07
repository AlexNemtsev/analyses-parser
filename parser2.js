import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFile } from 'node:fs/promises';

// Определяем тип анализа по тексту
function detectColumnCountFromText(fullText) {
  const text = fullText.toLowerCase();
  if (text.includes('анализ мочи')) return 4;
  if (text.includes('анализ крови')) return 5;
  return 4; // fallback
}

// Извлекаем текст с объединением логических фрагментов
async function extractStructuredItems(buffer) {
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  const pages = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // ←←← КЛЮЧЕВАЯ НАСТРОЙКА:
    const content = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false, // ← объединяет соседние текстовые элементы!
    });

    const pageText = content.items.map((i) => i.str).join(' ');
    fullText += ' ' + pageText;

    const items = content.items
      .map((item) => {
        let x = 0,
          y = 0;
        if (item.transform?.length >= 6) {
          const [a, b, c, d, tx, ty] = item.transform;
          x = tx;
          y = ty;
        }
        return {
          text: item.str.trim(),
          x,
          y,
        };
      })
      .filter((i) => i.text.length > 0);

    pages.push(items);
  }

  return { pages, fullText };
}

// Группируем по строкам (Y) и распределяем по столбцам
function buildTableFromItems(items, numColumns, yTolerance = 8) {
  if (items.length === 0) return [];

  // 1. Определяем границы столбцов
  const xs = items.map((i) => i.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const colWidth = (maxX - minX) / numColumns;

  const colBounds = Array.from({ length: numColumns }, (_, i) => ({
    left: minX + i * colWidth,
    right: minX + (i + 1) * colWidth,
  }));

  // 2. Определяем логические строки (Y-блоки)
  const allY = [...new Set(items.map((i) => Math.round(i.y / yTolerance) * yTolerance))];
  allY.sort((a, b) => b - a); // сверху вниз

  // Расширим блоки, чтобы захватить многострочные ячейки
  const rowHeight = yTolerance * 2.5; // высота строки таблицы
  const rowBlocks = allY.map((y) => ({
    top: y + rowHeight / 2,
    bottom: y - rowHeight / 2,
    yCenter: y,
  }));

  // 3. Собираем таблицу
  const table = [];
  for (const row of rowBlocks) {
    const cells = [];
    for (const col of colBounds) {
      // Собираем все фрагменты в прямоугольнике ячейки
      const fragments = items.filter(
        (item) =>
          item.x >= col.left && item.x <= col.right && item.y <= row.top && item.y >= row.bottom
      );

      // Сортируем по Y (сверху вниз → в PDF Y растёт вверх, поэтому по убыванию)
      fragments.sort((a, b) => b.y - a.y);

      const text = fragments.map((f) => f.text).join(' '); // или '\n'
      cells.push(text.trim());
    }

    if (cells.some((c) => c !== '')) {
      table.push(cells);
    }
  }

  return table;
}

// Удаляем дубликаты по первому столбцу (показатель)
function deduplicateByParam(table) {
  const seen = new Set();
  return table.filter((row) => {
    const param = row[0].trim();
    if (!param || seen.has(param)) return false;
    seen.add(param);
    return true;
  });
}

// Основная функция
async function parseLabPdf(buffer) {
  const { pages, fullText } = await extractStructuredItems(buffer);
  const numColumns = detectColumnCountFromText(fullText);

  const tables = [];
  for (const items of pages) {
    let table = buildTableFromItems(items, numColumns, 8);
    table = deduplicateByParam(table);
    tables.push(table);
  }

  return { tables, numColumns };
}

// --- Запуск ---
const filename = process.argv[2] || 'Ириска КМ.pdf';
const buffer = await readFile(filename);
const uint8 = new Uint8Array(buffer);
const result = await parseLabPdf(uint8);

console.log(`✅ Колонок: ${result.numColumns}`);
console.log('\n📋 Результат:\n');
result.tables[0].forEach((row, i) => {
  console.log(`[${i}]`, row);
});
