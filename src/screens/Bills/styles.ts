import styled from 'styled-components';

import { theme } from '@styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 96vh;

  margin-top: ${theme.size.sm};

  gap: ${theme.size.sm};

  @media (max-width: 1100px) {
    height: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.xxsm};

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  .select {
    max-width: 300px;
  }

  @media (max-width: 900px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  gap: ${theme.size.csm};
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
