import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const TagContainer = styled.div`
  width: fit-content;
  padding: 2px ${theme.size.xxsm};
  border-radius: ${theme.size.xxsm};
  background-color: ${theme.color.gray4};

  > p {
    color: ${theme.color.white};
    font-weight: 500;
  }
`;
