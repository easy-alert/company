// COMPONENTS
import { isValidImageUrl } from '@utils/isValidImageURL';
import * as Style from './styles';
import { IImg } from './types';

export const ImageComponent = ({
  src,
  size = '24px',
  width,
  height,
  alt = '',
  radius = '0%',
  rotate = '0deg',
  hasCircle,
}: IImg) => {
  let displaySrc = src;
  if (!isValidImageUrl(src)) {
    // tenta extrair o tipo do arquivo da url
    const matches = src.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
    const filetype = matches ? matches[1] : 'Anexo';
    // limita texto para ser exibido legalmente no placeholder
    const text = encodeURIComponent(filetype.length > 10 ? filetype.slice(0, 10) : filetype);
    displaySrc = `https://placehold.co/150?text=${text}&font=roboto`;
  }

  return (
    <Style.Img
      src={displaySrc}
      alt={alt}
      radius={radius}
      size={size}
      width={width}
      height={height}
      rotate={rotate}
      hasCircle={hasCircle}
    />
  );
};
