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
      try {
        extracted[key] = value[1];
      } catch {
        console.error(`Не удалось прочитать анализ ${key}:`, char);
      }
    }
  });

  return extracted;
};
