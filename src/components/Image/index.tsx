// Import React
import React from 'react';
// COMPONENTS
import * as Style from './styles';

// TYPES
import { ImageProps } from './utils/types';

export const Image = ({
  img,
  radius = '100%',
  size = '48px',
  width,
  height,
  alt,
  hasCircle,
  fill,
  strokeColor,
}: ImageProps) => (
  <Style.ImgHolder
    radius={radius}
    size={size}
    width={width}
    height={height}
    hasCircle={hasCircle}
    fill={fill}
    strokeColor={strokeColor}
  >
    {typeof img === 'string' ? (
      <img src={img} alt={alt ?? ''} />
    ) : (
      React.cloneElement(img as React.ReactElement, { fill, stroke: strokeColor })
    )}
  </Style.ImgHolder>
);
