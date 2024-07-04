import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.md};

  > p {
    color: ${theme.color.gray5};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const Card = styled.button<{ selected: boolean }>`
  all: unset;
  background-color: ${({ selected }) => (selected ? theme.color.gray3 : theme.color.gray1)};
  padding: ${theme.size.xsm} ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  flex-direction: column;
  gap: 2px;

  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  > .opacity {
    opacity: 0.7;
    font-weight: 400;
  }
`;
