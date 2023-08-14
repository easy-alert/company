import styled from 'styled-components';
import { IImg } from './types';

export const Img = styled.img<IImg>`
  ${({ size }) =>
    size && ` min-width:${size}; width: ${size}; min-height: ${size};  height: ${size};`}

  ${({ width }) => width && `min-width:${width} ; width: ${width};`}

  ${({ height }) => height && `min-height: ${height}; height: ${height};`}

  ${({ radius }) => radius && `border-radius:${radius};`}

  ${({ rotate }) => rotate && `rotate: ${rotate};`}

  object-fit: cover;

  display: grid;
  place-items: center;
`;
