import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
  padding: ${({ theme }) => theme.size.sm};
  width: 100%;
`;

export const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
`;

export const ButtonWrapper = styled.div<{ active?: boolean }>`
  width: 100%;
  background-color: ${({ active }) => (active ? '#EDEDED' : '#FFFFFF')};
  color: #000;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  border-top: ${({ active }) => (active ? '2px solid #CCCCCC' : 'none')};
  border-left: ${({ active }) => (active ? '2px solid #CCCCCC' : 'none')};
  border-right: ${({ active }) => (active ? '2px solid #CCCCCC' : 'none')};
  border-bottom: ${({ active }) => (!active ? '2px solid #CCCCCC' : 'none')};

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    width: 100%;
    text-align: center;
  }
`;
