export const arraysEqual = (a: any[], b: any[]): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const round = (value: number, precision: number): number => {
  const multiplier: number = Math.pow(10, precision || 0);

  return Math.round(value * multiplier) / multiplier;
};
