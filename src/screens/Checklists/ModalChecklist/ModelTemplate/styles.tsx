import styled from 'styled-components';
import { theme } from '@styles/theme';

export const Content = styled.div`
  background: ${theme.color.gray1};
  border-radius: 8px;
  padding: ${theme.size.sm};
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const SelectContainer = styled.div`
  padding: ${theme.size.md};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const SelectTitle = styled.p`
  font-size: 14px;
  color: ${theme.color.gray5};
  font-weight: 500;
  margin-bottom: ${theme.size.xsm};
`;

export const Option = styled.p`
  font-size: 14px;
  color: ${theme.color.gray6};
  padding: ${theme.size.xsm};
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

export const SelectedTemplateContainer = styled.div`
  margin-top: ${theme.size.md};
  padding: ${theme.size.sm};
  background-color: ${theme.color.gray2};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const TemplateTitle = styled.h3`
  font-size: 16px;
  margin-bottom: ${theme.size.xsm};
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TaskItem = styled.li`
  font-size: 14px;
  color: ${theme.color.gray6};
  padding: ${theme.size.xxsm} 0;
  border-bottom: 1px solid ${theme.color.gray3};

  &:last-child {
    border-bottom: none;
  }
`;
