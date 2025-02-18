import styled from 'styled-components';

export const Content = styled.div`
  max-width: 500px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ChecklistHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  input[type='text'] {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    outline: none;

    &:focus {
      border-color: #007bff;
    }
  }
`;

export const InputText = styled.div`
  margin-bottom: 20px;

  input[type='text'] {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #007bff;
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;
