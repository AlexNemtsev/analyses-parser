/**
 *
 * @param {string[]} textArr
 * @returns string
 */

export const extractCommonBlood = (textArr) => {
  const regex = /(.*?)(\d+(?:,\d+)?)(?=\s)(.*)/;

  // console.log(textArr);

  return textArr.map((str, i) => {
    const [, name, value] = str.match(regex) || [];
    const lastNameSpaceIndex = name?.trim().lastIndexOf(' ');

    let trimmed = name;

    if (lastNameSpaceIndex !== -1) {
      trimmed = name.substring(0, lastNameSpaceIndex);
    } else {
      trimmed = name.trim();
    }

    trimmed = trimmed
      .replace('Пг', 'Среднее содержание Hb в эритроците(MCH)')
      .replace('мкм^', 'Средний объём эритроцита(MCV)')
      .replace('% от', 'Ядерные эритроциты (нормобласты, nRBC)');

    if (i === 4) {
      trimmed = trimmed.replace('%', 'Средняя концентрация Hb в эритроците (MCHC)');
    } else if (i === 6) {
      trimmed = trimmed.replace('%', 'Показатель анизоцитоза эритроцитов (RDW)');
    } else if (i === 17) {
      trimmed = trimmed.replace('х10^9/л', 'Скорректированные истинные лейкоциты');
    } else if (i === 18) {
      trimmed = trimmed.replace('х10^9/л', 'Палочкоядерные нейтрофилы ABS');
    } else if (i === 19) {
      trimmed = trimmed.replace('х10^9/л', 'Сегментоядерные нейтрофилы ABS');
    } else if (i === 20) {
      trimmed = trimmed.replace('х10^9/л', 'Эозинофилы ABS');
    }

    return [trimmed, value];
  });
};
