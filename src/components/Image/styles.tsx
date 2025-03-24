import styled from 'styled-components';
// TYPES
import { ImageProps } from './utils/types';

export const ImgHolder = styled.div<ImageProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 0;

  ${({ size }) =>
    size && `min-width:${size}; width: ${size}; min-height: ${size}; height: ${size};`}

  ${({ width }) => width && `min-width:${width}; width: ${width};`}

  ${({ height }) => height && `min-height: ${height}; height: ${height};`}


  > img {
    object-fit: contain;

    ${({ radius }) => radius && `border-radius:${radius};`}

    ${({ size }) =>
      size && `min-width:${size}; width: ${size}; min-height:${size}; height:${size};`}

    ${({ width }) => width && `min-width:${width}; width:${width};`}

    ${({ height }) => height && `min-height:${height}; height:${height};`}
  }
`;
