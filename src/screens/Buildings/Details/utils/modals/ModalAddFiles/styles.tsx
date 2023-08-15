import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  > :last-child {
    margin-top: ${theme.size.sm};
  }

  > h6 {
    margin-top: ${theme.size.xsm};
  }
`;

export const DragAndDropZone = styled.div`
  margin-top: ${theme.size.xxsm};
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  overflow: hidden;
  cursor: pointer;
  transition: 0.25s;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100px;

  :hover {
    opacity: 0.7;
  }
`;

export const TagsWrapper = styled.div`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  > p {
    color: ${theme.color.gray4};

    ::after {
      content: 'Clique para selecionar seus arquivos ou arraste e solte aqui.';

      @media (max-width: 900px) {
        content: 'Clique aqui para enviar seus arquivos.';
      }
    }
  }
`;
