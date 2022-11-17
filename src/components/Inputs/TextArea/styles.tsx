import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const TextAreaContainer = styled.div<{ height: string }>`
  display: flex;
  flex-direction: column;
  > h6 {
    margin-bottom: ${theme.size.xxsm};
  }
  width: 100%;
  ${({ height }) =>
    height &&
    `
  > textarea {
    height:${height} ;
  }`}
`;

export const LengthCounter = styled.div`
  width: 100%;
  border-radius: ${theme.size.xxsm};
  background-color: white;
  text-align: right;
  > p {
    color: ${theme.color.gray4};
  }
`;
