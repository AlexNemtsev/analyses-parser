export const extractDigitCharacteristics = (characteristics: string[]): Record<string, string> => {
  const regex = /(.*?)(\d+(?:,\d+)?)(?=\s)(.*)/;

  const splitted = characteristics.map((str) => {
    const [, name, value] = str.match(regex) || [];
    const lastNameSpaceIndex = name?.trim().lastIndexOf(' ');

    let trimmed = name;

    if (lastNameSpaceIndex !== -1) {
      trimmed = name.substring(0, lastNameSpaceIndex);
    } else {
      trimmed = name.trim();
    }

    return [trimmed, value];
  });

  return Object.fromEntries(splitted);
};
