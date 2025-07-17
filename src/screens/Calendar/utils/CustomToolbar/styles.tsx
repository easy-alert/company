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
    min-width: 60px;
    border-radius: 0px 4px 4px 0px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray4};
    color: #373a3c;
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
    min-width: 60px;
    border-radius: 0px 4px 4px 0px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray4};
    color: #373a3c;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: ${({ theme }) => theme.color.gray3};
    }
  }
`;

export const ViewButtonWrapper = styled.div<IButtonWrapperProps>`
  border: 1px solid ${({ theme }) => theme.color.gray4};
  background: ${({ selected, theme }) => (selected ? theme.color.gray3 : theme.color.white)};
  border-radius: 4px;
  margin-left: 4px;

  &:first-child {
    margin-left: 0;
  }

  button {
    background: transparent;
    border: none;

    &:hover {
      background: ${({ theme }) => theme.color.gray3};
    }
  }
`;
