import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ModalDescription = styled.p`
  font-size: 0.75rem;
  color: ${theme.color.gray4};
  margin-bottom: ${theme.size.xsm};
`;

export const ModalApartmentsTitle = styled.h3`
  font-size: ${theme.size.sm};
`;

export const ApartmentList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  column-gap: ${theme.size.xsm};
  row-gap: ${theme.size.sm};

  margin-top: ${theme.size.xsm};
`;

export const ApartmentItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  background-color: ${theme.color.gray1};
  border-radius: ${theme.size.xsm};

  padding-left: ${theme.size.xsm};
  padding-right: ${theme.size.xsm};

  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ApartmentNumber = styled.p`
  font-size: ${theme.size.sm};
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.size.xsm};

  margin-top: ${theme.size.md};
`;
