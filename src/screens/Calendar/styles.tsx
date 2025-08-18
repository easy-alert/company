import styled from 'styled-components';

export const Container = styled.header`
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const Header = styled.header<{ arrowColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: ${({ theme }) => theme.size.sm};

  margin-bottom: ${({ theme }) => theme.size.sm};

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.size.xxsm};
  }
`;

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  align-items: end;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  gap: ${({ theme }) => theme.size.sm};
`;

export const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const CustomEvent = styled.div<{ status?: string }>`
  background-color: ${({ theme }) => theme.color.gray0};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.size.xsm};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  color: ${({ theme }) => theme.color.gray6};
  cursor: pointer;
  padding: 0 4px;
  white-space: normal;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  &.status-expired {
    border-left: ${({ theme }) => theme.size.xsm} solid ${({ theme }) => theme.color.danger};
  }
  &.status-pending,
  &.status-overdue {
    border-left: ${({ theme }) => theme.size.xsm} solid ${({ theme }) => theme.color.warning};
  }
  &.status-completed {
    border-left: ${({ theme }) => theme.size.xsm} solid ${({ theme }) => theme.color.success};
  }
`;

export const CustomEventHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 6px;
  margin-bottom: 4px;

  strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    font-weight: 700;
  }
`;

export const CustomEventTags = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
`;

export const CustomEventElement = styled.div`
  margin-bottom: 2px;
  font-size: 13px;
`;

export const CustomEventFrequency = styled.div`
  font-size: 13px;
`;
