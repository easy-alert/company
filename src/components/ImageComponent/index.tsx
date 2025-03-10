// COMPONENTS
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
}: IImg) => (
  <Style.Img
    src={src}
    alt={alt}
    radius={radius}
    size={size}
    width={width}
    height={height}
    rotate={rotate}
    hasCircle={hasCircle}
  />
);
