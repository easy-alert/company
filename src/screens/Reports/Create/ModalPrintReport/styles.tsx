import { StyleSheet } from '@react-pdf/renderer';
import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  position: relative;
  background-color: ${theme.color.white};
  z-index: 1;

  > :last-child {
    margin-top: ${theme.size.xsm};
    margin-left: auto;
  }
`;

export const SmallLoading = styled.div`
  position: absolute;
  left: 125px;
  top: 24px;

  border: 4px solid ${theme.color.primaryL};
  border-top: 4px solid ${theme.color.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const pdf = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
    fontSize: 8,
    color: theme.color.gray5,
  },

  companyLogo: {
    height: 40,
    width: 60,
    objectFit: 'contain',
  },

  easyAlertLogo: {
    width: 77,
    height: 17,
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },

  headerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    justifyContent: 'flex-start',
    maxWidth: 250,
  },

  headerSide: {
    display: 'flex',
    flexDirection: 'row',
  },

  footer: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
