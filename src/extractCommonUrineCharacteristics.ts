import { commonUrineCharacteristics } from './commonUrineCharacteristics';

export const extractCommonUrineCharacteristics = (
  characteristics: string[]
): Record<string, string> => {
  const extracted: Record<string, string> = {};
  const keys = Object.keys(commonUrineCharacteristics);

  characteristics.forEach((char) => {
    const keyIndex = keys.findIndex((key) => char.startsWith(key));

    if (keyIndex !== -1) {
      const key = keys[keyIndex];
      const [value] = [...char.matchAll(commonUrineCharacteristics[key])];
      extracted[key] = value[1];
    }
  });

  return extracted;
};
