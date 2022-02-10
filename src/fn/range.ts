export function range(from: number, to: number): number[] {
  if (to < from) {
    return [];
  }
  const size = to - from + 1;
  const numbers: number[] = Array(size);
  for (let i = 0; i < size; i += 1) {
    numbers[i] = from + i;
  }
  return numbers;
}
