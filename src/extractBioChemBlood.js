/**
 *
 * @param {string[]} textArr
 * @returns string
 */

export const extractBioChemBlood = (textArr) => {
  const regex = /(.*?)(\d+(?:,\d+)?)(?=\s)(.*)/;

  console.log(textArr);

  return textArr.map((str) => {
    const [, name, value] = str.match(regex) || [];
    const lastNameSpaceIndex = name?.trim().lastIndexOf(' ');

    return [
      name.substring(0, lastNameSpaceIndex).replace('расчетный,', 'Соотношение Мочевина/креатинин'),
      value,
    ];
  });
};
