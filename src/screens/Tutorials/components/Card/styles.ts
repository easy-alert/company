import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Card = styled.div`
  display: flex;

  width: 300px;
  height: 330px;
  flex-direction: column;
  border-radius: ${theme.size.xxsm};
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};

  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;
