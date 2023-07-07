import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  height: 100%;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
`;

export const TutorialsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.sm};
  flex-wrap: wrap;
  height: 100%;
`;
