import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Counts = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${theme.size.sm};
`;

export const CountsInfo = styled.div`
  .pending {
    color: ${theme.color.warning};
  }
  .expired {
    color: ${theme.color.actionDanger};
  }

  .completed {
    color: ${theme.color.success};
  }

  > p {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

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

export const FiltersContainer = styled.div`
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

export const ButtonContainer = styled.div`
  margin-top: ${theme.size.sm};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;

export const CountContainer = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
