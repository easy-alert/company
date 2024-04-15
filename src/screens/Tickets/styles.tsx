import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.xxsm};
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
  gap: ${theme.size.md};
`;

export const Card = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  cursor: pointer;
  transition: 0.1s;
  :hover {
    scale: 1.05;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > h5 {
    font-weight: 500;
    color: ${theme.color.primary};
  }
`;

export const CardHeaderRightSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  > p {
    font-weight: 500;
  }

  > :first-child {
    color: ${theme.color.gray4};
  }
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 0.6fr 0.8fr 71px;

  align-items: flex-end;
  gap: ${theme.size.xsm};
  max-width: 70%;

  > :last-child {
    margin-left: ${theme.size.xsm};
  }

  @media (max-width: 900px) {
    max-width: 100%;
    grid-template-columns: 1fr;

    background-color: ${theme.color.white};
    padding: ${theme.size.sm};
    border-radius: ${theme.size.xxsm};

    > :last-child {
      margin-left: auto;
      margin-top: ${theme.size.xsm};
    }
  }
`;

export const SelectedTickets = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${theme.color.primary};
  font-weight: 500;
`;

export const PaginationFooter = styled.footer`
  margin-top: 8px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-end;
`;

export const PaginationContainer = styled.div`
  min-height: calc(100vh - 80px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const DayWrapper = styled.div<{ reduceOpacity?: boolean }>`
  display: flex;
  align-items: center;
  transition: 0.25s;

  ${({ reduceOpacity }) =>
    reduceOpacity &&
    css`
      opacity: 0.3;
      :hover {
        opacity: 0.3 !important;
      }
    `}

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;

export const NoDataDayWrapper = styled.div`
  display: flex;
  align-items: center;
  transition: 0.25s;
`;

export const DayInfo = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.size.xxsm};
  width: ${({ width }) => width || '45px'};

  > p {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

export const Maintenance = styled.div<{
  status: 'expired' | 'pending' | 'completed' | 'overdue' | string;
}>`
  min-height: 62px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.sm} ${theme.size.md};

  ${({ status }) =>
    (status === 'completed' || status === 'overdue') &&
    css`
      background: linear-gradient(
        90deg,
        rgba(52, 181, 58, 1) 0%,
        rgba(52, 181, 58, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}

  ${({ status }) =>
    status === 'expired' &&
    css`
      background: linear-gradient(
        90deg,
        rgba(255, 53, 8, 1) 0%,
        rgba(255, 53, 8, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}

    ${({ status }) =>
    status === 'pending' &&
    css`
      background: linear-gradient(
        90deg,
        rgba(255, 178, 0, 1) 0%,
        rgba(255, 178, 0, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}
`;

export const MaintenanceTags = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;

  margin-bottom: ${theme.size.xsm};
`;

export const NoMaintenanceCard = styled.div`
  width: 100%;
  min-height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.sm} ${theme.size.md};
  background: linear-gradient(
    90deg,
    rgb(217, 217, 217) 0%,
    rgb(217, 217, 217) 7px,
    rgba(250, 250, 250, 1) 7px,
    rgba(250, 250, 250, 1) 100%
  );
`;

export const NoDataContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 84%;
  gap: ${theme.size.xxsm};
  > h3 {
    color: ${theme.color.gray4};
    text-align: center;
  }
`;

export const HeaderLeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  width: 100%;

  > :nth-child(2) {
    max-width: 300px;
  }
`;

export const HeaderRightSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  justify-content: flex-end;
  width: fit-content;
`;
