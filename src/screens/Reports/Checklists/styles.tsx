import styled, { css } from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Counts = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CountsInfo = styled.div`
  .pending {
    color: #d5d5d5;
  }

  .inProgress {
    color: #ffb200;
  }

  .completed {
    color: #34b53a;
  }

  > p {
    color: ${({ theme }) => theme.color.gray4};
    font-weight: 500;
  }
`;

export const Container = styled.div`
  padding-top: ${({ theme }) => theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};
`;

export const FiltersGrid = styled.div`
  margin-top: ${({ theme }) => theme.size.sm};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  white-space: nowrap;

  @media (max-width: 900px) {
    margin-top: 8px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CountContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NoMaintenanceCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${({ theme }) => theme.color.gray4};
`;

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const ViewButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CustomButton = styled.button<{ active: boolean }>`
  padding: 0;
  background-color: unset;

  font-weight: 500;
  border-radius: 0;
  padding-bottom: ${({ theme }) => theme.size.xsm};
  font-size: 14px;
  line-height: 16px;

  ${({ active, theme }) =>
    active
      ? css`
          color: ${theme.color.primary};
          border-bottom: 1px solid ${theme.color.primary};
        `
      : css`
          color: ${theme.color.gray4};
        `}
`;
