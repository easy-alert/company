import styled from 'styled-components';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.size.sm};
  padding-top: ${({ theme }) => theme.size.sm};

  > h2 {
    margin-bottom: ${({ theme }) => theme.size.xsm};
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const CardHeaderButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const AnnexCardTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const MaintenanceCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.size.sm};
  width: 100%;
`;

export const FirstCard = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: ${({ theme }) => theme.size.sm};
    flex-direction: column;
  }
`;

export const CardHeaderLeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const Card = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};
  height: fit-content;
`;

export const AnnexCard = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};
  height: fit-content;
  min-height: 169px;

  @media (max-width: 1100px) {
    min-height: fit-content;
  }
`;

export const AnnexCardHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};

  > button {
    padding: unset;
    background-color: unset;
    width: fit-content;

    color: ${({ theme }) => theme.color.gray4};
    font-size: 12px;
    cursor: pointer;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    max-width: 90px;

    :hover {
      opacity: 0.7;
    }
  }

  > p {
    color: ${({ theme }) => theme.color.gray4};
  }
`;

export const AnnexCardButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const MaintenanceCardFooter = styled.div`
  display: grid;
  grid-template-columns: repeat(4, fit-content(100%));
  grid-gap: ${({ theme }) => theme.size.sm};
`;

export const MaintenanceCardFooterInfo = styled.div`
  .pending {
    color: ${({ theme }) => theme.color.warning};
  }
  .expired {
    color: ${({ theme }) => theme.color.actionDanger};
  }
  .delayed {
    color: ${({ theme }) => theme.color.orange1};
  }
  .completed {
    color: ${({ theme }) => theme.color.success};
  }

  .tickets {
    color: ${({ theme }) => theme.color.gray4};
  }

  > p {
    color: ${({ theme }) => theme.color.gray4};
    font-weight: 500;
  }
`;

export const BuildingCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.size.xsm};
  }
`;

export const BuildingCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  width: 50%;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const BuildingCardData = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.size.xxsm};

  > :first-child {
    font-weight: 500;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
  justify-content: flex-end;
`;

export const MainContactTag = styled.div`
  padding: 2px 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.primaryL};
  width: fit-content;

  > p {
    color: ${({ theme }) => theme.color.primary};
    font-weight: 500;
  }
`;

export const TableDataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const NoDataContainer = styled.div`
  width: 100%;
  min-height: 80px;

  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;

  > h5 {
    color: ${({ theme }) => theme.color.gray4};
    text-align: center;
  }
`;

export const NoBanners = styled.div`
  width: 100%;
  min-height: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  > h5 {
    color: ${({ theme }) => theme.color.gray4};
    text-align: center;
  }
`;

export const NoAnnexes = styled.div`
  width: 100%;
  min-height: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  > h5 {
    color: ${({ theme }) => theme.color.gray4};
    text-align: center;
    margin-top: -20px;
  }
`;

export const TagWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: ${({ theme }) => theme.size.xsm};
`;

export const BannerWrapper = styled.div`
  margin-top: ${({ theme }) => theme.size.xsm};
  display: grid;
  gap: ${({ theme }) => theme.size.xsm};
  grid-template-columns: repeat(auto-fill, minmax(97px, 1fr));
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${({ theme }) => theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${({ theme }) => theme.size.xxsm};
  gap: ${({ theme }) => theme.size.xsm};

  > a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.size.xxsm};
    color: ${({ theme }) => theme.color.black};

    > p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      max-width: 185px;
    }

    transition: 0.25s;
    :hover {
      opacity: 0.7;
    }
  }
`;

export const PasswordDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const CountDiv = styled.div`
  color: ${({ theme }) => theme.color.gray6};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.size.xsm};
  height: 92px;
  font-weight: 500;

  > h3 {
    font-size: 40px;
    line-height: 42px;
  }

  > h4 {
    font-size: 20px;
    line-height: 22px;
  }

  > h5 {
    font-size: 16px;
    line-height: 18px;
  }
`;
