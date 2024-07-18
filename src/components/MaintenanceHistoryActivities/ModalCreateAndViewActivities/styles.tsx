import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.md};

  .opacity {
    opacity: 0.7;
  }
`;

export const ScrollDiv = styled(Container)`
  max-height: 600px;
  overflow-y: auto;
  min-height: 40px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${theme.size.xxsm};

  > :last-child {
    margin-bottom: 4px;
  }
`;

export const Comment = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  flex-direction: column;

  .p2 {
    color: ${theme.color.gray6};
    margin-left: 32px;
  }
`;

export const CommentInfo = styled.div`
  display: flex;
  gap: ${theme.size.xxsm};
  flex-direction: column;

  .p3 {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  align-items: flex-start;
`;
