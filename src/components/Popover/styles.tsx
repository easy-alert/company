import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PopoverBody = styled.div`
  width: 100%;
  min-height: fit-content;
  padding: ${theme.size.xsm};

  > h5 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.size.xsm};
  }

  > .p4 {
    margin: ${theme.size.xsm} 0;
    color: ${theme.color.gray5};
  }
`;

export const PopoverBackground = styled.div`
  display: flex;

  z-index: 8;
  border-radius: ${theme.size.xsm};
  background-color: ${theme.color.white};

  border: 2px solid ${theme.color.gray3};

  min-height: fit-content;
`;

export const AnimationDiv = styled.div`
  animation: fade-in 0.25s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const PopoverToggleDiv = styled.div``;
