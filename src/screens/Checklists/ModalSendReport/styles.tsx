import { theme } from '@styles/theme';
import styled from 'styled-components';

export const InputText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const ContainerBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.size.sm};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.size.sm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.sm};
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 136px;
  background-color: ${theme.color.actionBlue};
  border-radius: 8px;
`;
