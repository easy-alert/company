import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  height: 100%;
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  }

  cursor: pointer;
  transition: 0.1s;

  :hover {
    scale: 1.05;
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

export const Iframe = styled.iframe`
  width: 100%;
  height: 536px;
`;
