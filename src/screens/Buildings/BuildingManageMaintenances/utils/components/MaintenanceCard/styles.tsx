import styled, { css } from 'styled-components';

export const ArrowContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const Arrow = styled.div<{ cardIsOpen: boolean }>`
  transition: 0.25s;

  ${({ cardIsOpen }) => cardIsOpen && `transform: rotate(-180deg);`}
`;

export const Hr = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray2};
  margin-top: ${({ theme }) => theme.size.xsm};
`;

export const MaintenancesCard = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  background-color: ${({ theme }) => theme.color.white};

  transition: 0.25s;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => `${theme.color.white}B3`};
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
  gap: ${({ theme }) => theme.size.xsm};
  overflow: hidden;
  transition: max-height 0.25s;

  ${({ cardIsOpen }) =>
    cardIsOpen
      ? css`
          -webkit-max-height: 700px;
          max-height: 700px;
          min-height: fit-content;
        `
      : css`
          -webkit-max-height: 0px;
          max-height: 0px;
        `};
`;

export const MaintenancesCardGridMoreEditButton = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
  justify-content: flex-end;
  grid-area: 4/8;
  height: 100%;

  > div {
    height: 100%;
    display: flex;
    gap: 16px;
    align-items: flex-end;
  }
`;

export const PeriodIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
  white-space: nowrap;
`;

// GRIDS
export const MaintenancesGrid = styled.div<{ cardIsOpen: boolean }>`
  display: grid;
  align-items: center;
  width: 100%;
  grid-template-rows: 1fr;
  overflow: hidden;
  grid-gap: ${({ theme }) => theme.size.sm};
  grid-template-columns: 8px 230px minmax(280px, 0.8fr) 0.4fr 0.5fr 0.5fr 30px 30px;

  > p {
    line-height: 17px;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({ cardIsOpen }) => (cardIsOpen ? 11 : 4)};
    -webkit-box-orient: vertical;
  }

  > div {
    transition: 0.25s;
    :hover {
      opacity: 0.7;
    }
  }

  .copyIcon {
    margin-left: auto;
    width: fit-content;
  }
`;

export const MaintenancesMoreGrid = styled.div`
  align-items: flex-start;
  display: grid;
  width: 100%;
  grid-template-rows: auto;
  max-height: 100%;
  grid-gap: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
  grid-template-columns: 8px 230px minmax(280px, 0.8fr) 0.4fr 0.5fr 0.5fr 30px 30px;

  span {
    color: ${({ theme }) => theme.color.primary};
    font-weight: 500;
  }
  > p {
    line-height: 17px;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 15;
    -webkit-box-orient: vertical;
  }

  .instructions {
    grid-area: 4 / 2 / 4 / 4;

    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

export const AdditionalInformationsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const LastNotificationDate = styled(AdditionalInformationsWrapper)`
  grid-area: 3 / 2 / 3 / 4;
`;

export const DaysToAncitipateWrapper = styled(AdditionalInformationsWrapper)`
  grid-area: auto / 2 / auto / 4;
`;

export const FileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.size.xsm};
`;
