import styled from 'styled-components';

import { theme } from '@styles/theme';

export const OverviewContainer = styled.div`
  margin-bottom: ${theme.size.lg};
`;

export const OverviewCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.size.sm};
  margin-top: ${theme.size.xsm};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const OverviewCard = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  width: 100%;

  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const OverviewCardContent = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${theme.size.xsm};

  > h2 {
    font-size: 32px;
    line-height: 36px;
  }

  > p {
    font-size: 12px;
    opacity: 0.7;
    text-align: center;
  }

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;
