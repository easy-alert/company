export function unMaskPhone(value: string) {
  return value.replace(/[^a-zA-Z0-9@._-]/g, '');
}
