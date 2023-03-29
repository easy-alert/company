import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div<{
  height: string;
  width: string;
  maxHeight: string;
  maxWidth: string;
}>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};

  max-height: ${({ maxHeight }) => maxHeight};
  max-width: ${({ maxWidth }) => maxWidth};

  display: flex;
  flex-direction: column;
  position: relative;

  > img {
    border-radius: ${theme.size.xxsm} ${theme.size.xxsm} 0 0;
    height: calc(100% - 44px);
    width: 100%;
    object-fit: cover;
  }
`;

export const Label = styled.div`
  width: 100%;
  height: 44px;
  padding: ${theme.size.xsm};
  background-color: ${theme.color.gray1};
  border-radius: 0 0 ${theme.size.xxsm} ${theme.size.xxsm};
  display: flex;
  flex-direction: column;
  justify-content: center;

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p2 {
    color: ${theme.color.black};
  }

  .p5 {
    color: ${theme.color.gray5};
  }
`;

export const ActionsHover = styled.div`
  position: absolute;
  width: 100%;
  border-radius: ${theme.size.xxsm} ${theme.size.xxsm} 0 0;
  height: calc(100% - 44px);
  transition: 0.25s;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};
  background-color: #00000066;
  opacity: 0;

  :hover {
    opacity: 1;
  }

  > a {
    transition: 0.25s;

    :hover {
      opacity: 0.7;
    }
  }
`;
