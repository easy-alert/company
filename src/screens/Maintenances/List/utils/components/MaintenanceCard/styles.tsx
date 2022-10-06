import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const ArrowContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Arrow = styled.div<{ cardIsOpen: boolean }>`
  transition: 0.25s;

  ${({ cardIsOpen }) => cardIsOpen && `transform: rotate(-180deg);`}
`;

export const Hr = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${theme.color.gray2};
  margin-top: ${theme.size.xsm};
`;

export const MaintenancesCard = styled.div`
  display: flex;
  padding: ${theme.size.xsm} ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
  background-color: ${theme.color.white};
  transition: 0.25s;
  :hover {
    cursor: pointer;
  }
`;

export const MaintenancesCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MaintenancesCardTopContent = styled.div`
  display: flex;
  min-height: 80px;
`;

export const MaintenancesCardBottomContainer = styled.div<{ cardIsOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  overflow: hidden;
  transition: max-height 0.25s;

  ${({ cardIsOpen }) => (cardIsOpen ? `max-height: 80px;` : `max-height: 0px; `)};
`;

export const MaintenancesCardGridMoreEditButton = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${theme.size.xsm};
  justify-content: flex-end;
  grid-area: 1/6;
`;

export const MaintenancesCardBottomPeriod = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  > p {
    display: flex;
    gap: ${theme.size.xxsm};
  }
`;

export const PeriodIconWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xxsm};
`;

// GRIDS
export const MaintenancesGrid = styled.div<{ cardIsOpen: boolean }>`
  display: grid;
  align-items: center;
  width: 100%;
  grid-template-rows: 1fr;
  overflow: hidden;
  grid-gap: ${theme.size.sm};
  grid-template-columns: 250px minmax(250px, 1fr) 0.5fr 0.7fr 0.6fr 0.1fr;

  > p {
    line-height: 17px;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({ cardIsOpen }) => (cardIsOpen ? 6 : 4)};
    -webkit-box-orient: vertical;
  }
`;

export const MaintenancesMoreGrid = styled.div`
  overflow: hidden;

  display: grid;
  width: 100%;
  grid-template-rows: 1fr;
  grid-gap: ${theme.size.sm};
  grid-template-columns: 250px minmax(250px, 1fr) 0.5fr 0.7fr 0.6fr 0.1fr;

  span {
    color: ${theme.color.primary};
    font-weight: 500;
  }
  > p {
    overflow: hidden;
    word-wrap: break-word;
  }
`;
