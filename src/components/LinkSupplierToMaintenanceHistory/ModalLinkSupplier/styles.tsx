import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.md};

  > p {
    color: ${({ theme }) => theme.color.gray5};

    > span {
      text-decoration: underline;
      color: ${({ theme }) => theme.color.primary};
      cursor: pointer;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const Card = styled.button<{ selected: boolean }>`
  all: unset;
  background-color: ${({ theme, selected }) => (selected ? theme.color.gray3 : theme.color.gray1)};
  padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  display: flex;
  flex-direction: column;
  gap: 2px;

  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xxsm};

  > .opacity {
    opacity: 0.7;
    font-weight: 400;
  }
`;

export const ScrollDiv = styled(Section)`
  max-height: 300px;
  overflow-y: auto;
`;
