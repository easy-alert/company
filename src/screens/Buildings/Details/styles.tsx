import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.div`
  > h2 {
    margin-bottom: ${theme.size.xsm};
  }

  margin-bottom: ${theme.size.sm};
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

export const Card = styled.div`
  width: 100%;
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};
`;

export const MaintenanceCardFooter = styled.div`
  display: grid;
  grid-template-columns: repeat(4, fit-content(100%));
  grid-gap: ${theme.size.sm};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, fit-content(100%));
  }
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
  gap: ${theme.size.sm};

  @media (max-width: 900px) {
    flex-direction: column;
    gap: ${theme.size.xsm};
  }
`;

export const BuildingCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const BuildingCardData = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${theme.size.xxsm};

  > :first-child {
    font-weight: 500;
  }
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

export const PhoneNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
`;
