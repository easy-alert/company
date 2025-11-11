/*
 * Valida se a URL é uma imagem válida
 * 
 * @param url - A URL a ser validada
 * @returns true se a URL é uma imagem válida, false caso contrário
 */
export function isValidImageUrl(url: string): boolean {
  return /\.(jpe?g|webp|png)$/i.test(url.split('?')[0]);
};
