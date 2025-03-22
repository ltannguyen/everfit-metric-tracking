export const isEnumValue = <T extends object>(
  enumType: T,
  value: string,
): boolean => {
  return Object.values(enumType).includes(value);
};
