import styled from 'styled-components';

import { theme } from '@styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  height: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.size.sm};
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;

  > h4 {
    color: ${theme.color.gray4};
  }
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.size.md};

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  }
`;

export const Card = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.md};
  border-radius: ${theme.size.xsm};

  img {
    width: 100%;
    border-radius: ${theme.size.xsm};

    cursor: pointer;
    transition: 0.1s;

    :hover {
      scale: 1.02;
    }
  }

  @media (max-width: 900px) {
    :hover {
      scale: 1;
    }
  }

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: ${theme.size.xsm};

  > h5 {
    color: ${theme.color.black};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: ${theme.size.xsm};
`;

export const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
