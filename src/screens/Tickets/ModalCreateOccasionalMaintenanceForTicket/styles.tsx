import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const OnQueryContainer = styled.div`
  height: 340px;
`;

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      pointer-events: none;

      :hover {
        opacity: 1;
      }
    `}
`;

export const DragAndDropZoneFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 136px;
  min-width: 132px;

  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const DragAndDropZoneImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  height: 136px;
  width: 132px;
  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const FileRow = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.size.xsm};
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};
  gap: ${theme.size.xsm};

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    max-width: 154px;
  }
`;

export const FileLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  width: 130px;
  height: 24px;
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  height: 136px;
  width: 132px;
`;

export const customStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    cursor: 'pointer',
    border: `1px solid ${theme.color.gray4}`,
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: `1px solid ${theme.color.gray4}`,
    },
    minHeight: '32px',
    height: '32px',
    padding: 0,
    margin: 0,
  }),
  menu: (base: any) => ({
    ...base,
    marginTop: 2,
    fontSize: '14px',
  }),

  option: (base: any) => ({
    ...base,
    cursor: 'pointer',
    paddingLeft: '16px',
    fontSize: '14px',
  }),

  indicatorsContainer: (base: any) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
  }),

  valueContainer: (base: any) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
    padding: 0,
    paddingLeft: '13px',
    marginTop: -2,
    fontSize: '14px',
  }),

  input: (base: any) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
    padding: 0,
    margin: 0,
    paddingLeft: '3px',
    fontSize: '14px',
  }),

  placeholder: (base: any) => ({
    ...base,
    fontSize: '14px',
    padding: 0,
    margin: 0,
    paddingLeft: '3px',
  }),
};

export const ModalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ButtonContainer = styled.div`
  margin-top: ${theme.size.xsm};
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  cursor: pointer;
  color: ${theme.color.gray4};
  font-size: 14px;
  line-height: 16px;
`;
