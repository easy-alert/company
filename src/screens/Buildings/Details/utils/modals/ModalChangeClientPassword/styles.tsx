import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  > p {
    color: ${theme.color.gray4};
  }
`;
