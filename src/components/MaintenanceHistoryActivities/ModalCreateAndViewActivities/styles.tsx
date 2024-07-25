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

  > :nth-child(2),
  > :nth-child(3) {
    margin-bottom: 4px;
  }
`;

export const Comment = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  flex-direction: column;

  > .p2 {
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

export const SendDataSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.size.xsm};

  > .p2 {
    opacity: 0.7;
  }
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  height: 125px;
  width: 125px;
`;
