import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const ColumnContainer = styled.div`
  height: fit-content;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

export const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;

  min-height: fit-content;

  margin-top: -${({ theme }) => theme.size.xsm};
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const RowLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

export const RowValue = styled.span<{ color?: string; fontWeight?: string }>`
  font-weight: ${({ fontWeight }) => fontWeight || 500};
  font-size: 14px;
  line-height: 16px;

  color: ${({ color }) => color || 'black'};

  word-break: break-all;
`;

export const MovementsContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.sm};
`;

export const MovementContent = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.xxsm};
`;

export const MovementLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

export const MovementValue = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;

  word-break: break-all;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  gap: ${({ theme }) => theme.size.sm};
`;
