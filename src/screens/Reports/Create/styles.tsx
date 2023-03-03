import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const FiltersAndCount = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};
`;

export const FiltersGrid = styled.div`
  margin-top: ${theme.size.sm};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.size.xsm};
  margin-top: ${theme.size.xsm};
`;

export const Tag = styled.div`
  background-color: ${theme.color.primaryL};
  padding: ${theme.size.xxsm} ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};
  max-width: 200px;
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: ${theme.size.sm};
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};

  > :first-child {
    margin-left: auto;
  }
`;
