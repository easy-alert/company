import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.div`
  > h2 {
    margin-bottom: ${theme.size.xsm};
  }

  margin-bottom: ${theme.size.sm};
  padding-top: ${theme.size.sm};
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${theme.size.sm};
`;

export const MaintenanceCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Card = styled.div`
  width: 100%;
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};

  .bottom {
    height: calc(100% - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MaintenanceCardFooter = styled.div`
  display: grid;
  grid-template-columns: repeat(4, fit-content(100%));
  grid-gap: ${theme.size.sm};
`;

export const MaintenanceCardFooterInfo = styled.div`
  .pending {
    color: ${theme.color.warning};
  }
  .expired {
    color: ${theme.color.actionDanger};
  }
  .delayed {
    color: ${theme.color.orange1};
  }
  .completed {
    color: ${theme.color.success};
  }

  > p {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

export const BuildingCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: ${theme.size.xsm};
  }
`;

export const BuildingCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  width: 50%;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const BuildingCardData = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xxsm};

  > :first-child {
    font-weight: 500;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  justify-content: flex-end;
`;

export const MainContactTag = styled.div`
  padding: 2px 4px;
  border-radius: 2px;
  background-color: ${theme.color.primaryL};
  width: fit-content;

  > p {
    color: ${theme.color.primary};
    font-weight: 500;
  }
`;

export const TableDataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
`;

export const NoDataContainer = styled.div`
  width: 100%;

  > h5 {
    color: ${theme.color.gray4};
    text-align: center;
    margin-bottom: ${theme.size.xlg};
  }
`;

export const MatrixTagWrapper = styled.div`
  margin-top: ${theme.size.xsm};
  display: flex;
  gap: ${theme.size.xsm};
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};
  gap: ${theme.size.xsm};

  > a {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
    color: ${theme.color.black};

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
