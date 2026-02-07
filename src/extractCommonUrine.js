/**
 *
 * @param {string} textArr
 * @returns string
 */

export const extractCommonUrine = (pdfResult) => {
  const regex = /(.*?)(\d+(?:,\d+)?)(?=\s)(.*)/;

  const textArray = pdfResult.text.split('\n');
  const nameIndex = textArray.findIndex((str) => str.startsWith('Кличка'));
  const filtered = textArray.slice(nameIndex + 3);

  console.log(filtered);

  return [
    ['Цвет', filtered[0].split(' ')[2]],
    ['Прозрачность', filtered[1].split(' ')[2]],
    ['pH', filtered[2].split(' ')[3]],
    ['Белок', filtered[3].split(' ').slice(2, 4).join(' ')],
    ['Плотность', filtered[5].split(' ')[2]],
    ['Глюкоза', filtered[6].split(' ')[2]],
    ['Уробилиноген', filtered[7].split(' ')[2]],
    ['Билирубин', filtered[10].split(' ')[0]],
    ['Кетоны ммоль/л 0 0,0', filtered[11].split(' ')[2]],
    ['Гемоглобин', filtered[14].split(' ')[0]],
    ['Эритроциты в поле зрения отс 0 - 2', filtered[15].split(' ')[4]],
    ['Лейкоциты в поле зрения 1-0-1 0 - 5', filtered[16].split(' ')[4]],
    [
      'Неорганизованный осадок в поле зрения струвиты 15-12-13 единичные кристаллы',
      filtered[17].split(' ')[4],
    ],
    ['Эпителий плоский в поле зрения 1-0-2 0 - 5'],
    ['Эпителий переходный в поле зрения отс 0'],
    ['Эпителий почечный (тубулярный) в поле зрения отс 0'],
    ['Бактерии в поле зрения кокки + единичные при соблюдении правил'],
    ['сбора, хранения'],
    ['Цилиндры в поле зрения отс 0 - 1'],
    ['Слизь в поле зрения отс может присутствовать'],
    ['Спермии в поле зрения отс отсутствуют'],
  ];
};
