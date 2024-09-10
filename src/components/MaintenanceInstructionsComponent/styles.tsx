import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xsm};
`;

export const FileRow = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;
  margin-top: 20px;
`;
