import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Background = styled.div`
  position: relative;
`;

export const Wrapper = styled.div`
  background-color: ${theme.color.gray2};
  border-radius: ${theme.size.xxsm};
  cursor: pointer;

  display: flex;
  align-items: center;

  width: 100%;

  min-width: 0;

  > button {
    all: unset;
    margin-left: auto;
    padding: ${theme.size.xsm} ${theme.size.xsm} ${theme.size.xsm} 4px;
  }

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${theme.color.gray5};
  }

  :hover {
    opacity: 0.7;
  }
`;

export const Download = styled.a`
  all: unset;
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  padding: ${theme.size.xsm};
  min-width: 0;
  width: 100%;

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${theme.color.gray5};
  }
`;

export const Label = styled.div`
  all: unset;
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  min-width: 0;
  height: 100%;
  width: 100%;
  padding: ${theme.size.xsm} 0 ${theme.size.xsm} ${theme.size.xsm};

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${theme.color.gray5};
  }
`;

export const Dropdown = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  position: absolute;
  bottom: 10px;
  right: -82px;
  z-index: 9;

  > a {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
    color: ${theme.color.gray5};

    :hover {
      opacity: 0.7;
    }
  }
`;
