import styled from 'styled-components';

export const LoadingContainer = styled.div<{ bgColor?: string }>`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  .dot-pulse {
    position: relative;
    left: -9999px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: ${({ theme, bgColor }) => bgColor || theme.color.primary};
    color: ${({ theme, bgColor }) => bgColor || theme.color.primary};
    box-shadow: 9999px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    animation: dotPulse 1.5s infinite linear;
    animation-delay: 0.25s;
  }

  .dot-pulse::before,
  .dot-pulse::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: ${({ theme, bgColor }) => bgColor || theme.color.primary};
    color: ${({ theme, bgColor }) => bgColor || theme.color.primary};
  }

  .dot-pulse::before {
    box-shadow: 9984px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    animation: dotPulseBefore 1.5s infinite linear;
    animation-delay: 0s;
  }

  .dot-pulse::after {
    box-shadow: 10014px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    animation: dotPulseAfter 1.5s infinite linear;
    animation-delay: 0.5s;
  }

  @keyframes dotPulseBefore {
    0% {
      box-shadow: 9984px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    30% {
      box-shadow: 9984px 0 0 2px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    60%,
    100% {
      box-shadow: 9984px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
  }

  @keyframes dotPulse {
    0% {
      box-shadow: 9999px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    30% {
      box-shadow: 9999px 0 0 2px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    60%,
    100% {
      box-shadow: 9999px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
  }

  @keyframes dotPulseAfter {
    0% {
      box-shadow: 10014px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    30% {
      box-shadow: 10014px 0 0 2px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
    60%,
    100% {
      box-shadow: 10014px 0 0 -5px ${({ theme, bgColor }) => bgColor || theme.color.primary};
    }
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  opacity: 0.7;

  > h4 {
    margin-bottom: ${({ theme }) => theme.size.xsm};
  }
`;
