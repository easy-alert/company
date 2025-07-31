import styled from 'styled-components';

interface IButtonWrapperProps {
  selected?: boolean;
}

export const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.size.sm} 0;
  background: ${({ theme }) => theme.color.white};
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    min-width: ${({ theme }) => theme.size.xxxlg};
    border-radius: ${({ theme }) => theme.size.xxsm};
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray3};
    color: ${({ theme }) => theme.color.gray5};
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: ${({ theme }) => theme.color.gray3};
    }
  }
`;

export const Title = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const ViewSwitcher = styled.div`
  display: flex;
  align-items: center;

  button {
    min-width: ${({ theme }) => theme.size.xxxlg};
    border-radius: ${({ theme }) => theme.size.xxsm};
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray3};
    color: ${({ theme }) => theme.color.gray5};
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: ${({ theme }) => theme.color.gray3};
    }
  }
`;

export const ViewButtonWrapper = styled.div<IButtonWrapperProps>`
  border: 1px solid ${({ theme }) => theme.color.gray3};
  background: ${({ selected, theme }) => (selected ? theme.color.gray3 : theme.color.white)};
  border-radius: ${({ theme }) => theme.size.xxsm};
  margin-left: ${({ theme }) => theme.size.xxsm};

  &:first-child {
    margin-left: 0;
  }

  button {
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.size.xsm};

    &:hover {
      background: ${({ theme }) => theme.color.gray3};
    }
  }
`;
