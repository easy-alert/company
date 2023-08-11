import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FolderWrapper = styled.div`
  position: relative;
  background-color: ${theme.color.gray2};
  padding: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  min-width: 0;
  max-width: 150px;

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${theme.color.black};
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
  top: -35px;
  right: -60px;
  z-index: 10;
`;
