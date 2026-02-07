/**
 *
 * @param {string[]} textArr
 * @returns string
 */

export const extractBioChemUrine = (textArr) => {
  const filtered = textArr.filter((str) => str.match(/^\D/));

  const regex = /(.*?)(\d+(?:,\d+)?)(?=\s)(.*)/;

  return filtered.slice(0, filtered.length - 1).map((str) => {
    const [, name, value] = str.match(regex) || [];
    const lastNameSpaceIndex = name?.trim().lastIndexOf(' ');

    let trimmed = name;

    if (lastNameSpaceIndex !== -1) {
      trimmed = name.substring(0, lastNameSpaceIndex);
    } else {
      trimmed = name.trim();
    }

    return [trimmed.replace('расчетный', 'Соотношение Белок/Креатинин мочи'), value];
  });
};
