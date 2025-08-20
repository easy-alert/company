import styled from 'styled-components';

export const Container = styled.div`
  button[type='submit'] {
    margin-top: ${({ theme }) => theme.size.xsm};
  }
`;

export const FrequencyWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.size.xsm};

  > .p2 {
    opacity: 0.7;
  }
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background-color: ${({ theme }) => theme.color.gray0};
  border-radius: ${({ theme }) => theme.size.xsm};
`;
