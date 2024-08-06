import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const TableCard = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
`;

export const NoMaintenanceCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${theme.color.gray4};
`;
