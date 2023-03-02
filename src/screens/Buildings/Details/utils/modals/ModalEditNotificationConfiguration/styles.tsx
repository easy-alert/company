import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const FormContainer = styled.div`
  input[type='checkbox'] {
    width: 16px;
    height: 16px;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};
  width: 100%;
`;

export const MainContactObservation = styled.div`
  display: flex;
  gap: ${theme.size.xxsm};
  align-items: flex-start;

  > p {
    color: ${theme.color.gray4};
  }
`;
