import styled from 'styled-components';
import { theme } from '@styles/theme';

export const Content = styled.div`
  padding: ${theme.size.sm};
  background-color: #f9f9f9;
  border-radius: ${theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const SelectTitle = styled.p`
  font-size: 14px;
  color: ${theme.color.gray5};
  font-weight: 500;
  margin-bottom: ${theme.size.xsm};
`;

export const TemplateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  padding-left: ${theme.size.xsm};
  padding-right: ${theme.size.xsm};

  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${theme.color.gray2};
  }

  &:active {
    background-color: ${theme.color.gray3};
  }
`;

export const TemplateOption = styled.p`
  font-size: 14px;
  color: ${theme.color.gray6};
  padding: ${theme.size.xsm};
`;

export const SelectedTemplate = styled.div`
  margin-top: ${theme.size.sm};
  padding: ${theme.size.sm};
  background-color: ${theme.color.gray2};
  border-radius: ${theme.size.xsm};
`;

export const SelectedTemplateTitle = styled.p`
  font-size: 14px;
  color: ${theme.color.gray5};
  font-weight: 500;
  margin-bottom: ${theme.size.xsm};
`;

export const SelectedTemplateTasks = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SelectedTemplateTask = styled.p`
  font-size: 14px;
  color: ${theme.color.gray6};
  margin-bottom: ${theme.size.xsm};
`;
