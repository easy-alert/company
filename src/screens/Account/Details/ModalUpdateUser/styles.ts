import styled from 'styled-components';

import { theme } from '@styles/theme';

export const PasswordDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  > :nth-child(2) {
    position: absolute;
    top: 26px;
    right: 16px;
  }
`;

export const ColorPickerContainer = styled.div`
  margin-bottom: ${theme.size.xsm};
  display: flex;
  align-items: center;
  gap: ${theme.size.xlg};
  padding-bottom: 2rem;
  padding-top: 2rem;
`;

export const SelectedColorBox = styled.div<{ selectedColor: string }>`
  width: 100px;
  height: 100px;
  background-color: ${({ selectedColor }) => selectedColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 25px;
  color: ${({ selectedColor }) => selectedColor};
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
`;
