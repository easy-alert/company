import styled, { css } from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';
import { StylesConfig } from 'react-select';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const OnQueryContainer = styled.div`
  height: 485px;
`;

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xxsm};

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

export const FileRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size.xsm};
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const DragAndDropZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 97px;
  min-width: 97px;
  border: 1px dashed ${({ theme }) => theme.color.gray4};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm} ${({ theme }) => theme.size.md};
  cursor: pointer;
  transition: 0.25s;

  :hover {
    opacity: 0.7;
  }
`;

export const DragAndDropZoneFile = styled(DragAndDropZone)``;
export const DragAndDropZoneImage = styled(DragAndDropZone)``;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${({ theme }) => theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${({ theme }) => theme.size.xxsm};
  gap: ${({ theme }) => theme.size.xsm};

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    max-width: 120px;
  }
`;

export const FileLoadingTag = styled(Tag)`
  padding: 8px 12px;
  width: 130px;
  height: 24px;
`;

export const ImageLoadingTag = styled(Tag)`
  height: 97px;
  min-width: 97px;
`;

export const customStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    cursor: 'pointer',
    border: `1px solid ${defaultTheme.color.gray4}`,
    borderRadius: defaultTheme.size.xxsm,
    boxShadow: state.isFocused ? `0 0 0 2px ${defaultTheme.color.primaryL}` : 'none',
    '&:hover': {
      border: `1px solid ${defaultTheme.color.gray3}`,
    },
    minHeight: '32px',
    height: '32px',
    padding: '0 8px',
    transition: 'border 0.2s ease-in-out',
  }),
  menu: (base) => ({
    ...base,
    marginTop: 2,
    fontSize: '14px',
  }),
  option: (base) => ({
    ...base,
    cursor: 'pointer',
    paddingLeft: '16px',
    fontSize: '14px',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
  }),
  valueContainer: (base) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
    padding: '0 8px',
    fontSize: '14px',
  }),
  input: (base) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
    paddingLeft: '3px',
    fontSize: '14px',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '14px',
    paddingLeft: '3px',
  }),
};

export const ModalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.size.sm};

  div {
    display: flex;
    gap: ${({ theme }) => theme.size.xxxxlg};
    align-items: center;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray4};
  font-size: 14px;
  line-height: 16px;
`;

export const ErrorMessage = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.actionDanger};
  margin-top: -3px;
`;
