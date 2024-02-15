import { StyleSheet } from '@react-pdf/renderer';
import styled, { css } from 'styled-components';
import { theme } from '../../../../styles/theme';
import { IEventTag } from '../../../Calendar/utils/EventTag/types';

export const TagContainer = styled.div<IEventTag>`
  width: fit-content;
  padding: 2px ${theme.size.xxsm};
  border-radius: ${theme.size.xxsm};

  > p {
    color: ${theme.color.white};
    font-weight: 500;
    white-space: nowrap;
  }

  ${({ status }) =>
    status === 'completed' &&
    css`
      background-color: ${theme.color.success};
    `}
  ${({ status }) =>
    status === 'overdue' &&
    css`
      background-color: ${theme.color.primaryM};
    `}
    ${({ status }) =>
    status === 'pending' &&
    css`
      background-color: ${theme.color.warning};
    `}
    ${({ status }) =>
    status === 'expired' &&
    css`
      background-color: ${theme.color.actionDanger};
    `};

  ${({ status }) =>
    status === 'occasional' &&
    css`
      background-color: ${theme.color.purple};
    `};
`;

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
    fontSize: '10px',
    color: theme.color.gray5,
    fontFamily: 'DMSans',
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
    marginBottom: 10,
  },

  headerSide: {
    display: 'flex',
    flexDirection: 'row',
  },

  headerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },

  bold700: {
    fontWeight: 700,
  },

  bold500: {
    fontWeight: 500,
  },

  normal: {
    fontWeight: 400,
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  footer: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  },

  cardDateColumn: {
    color: theme.color.gray4,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
    fontWeight: 500,
  },

  card: {
    display: 'flex',
    flexDirection: 'row',
  },

  tag: {
    width: '4px',
    backgroundColor: '#34B53A',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
  },

  month: {
    fontSize: '16px',
    fontWeight: 500,
  },

  content: {
    padding: '6px 6px 6px 10px',
    backgroundColor: `${theme.color.gray3}80`,
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    width: '100%',

    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  contentHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    fontWeight: 500,
  },

  maintenanceTag: {
    color: theme.color.white,
    borderRadius: '4px',
    padding: '2px 4px',
    backgroundColor: '#34B53A',
    fontSize: '10px',
  },

  contentData: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
  },

  contentColumn1: {
    width: '378px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  contentColumn2: {
    width: '288px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  contentColumn3: {
    width: '343px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  images: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },

  image: {
    width: '56px',
    height: '56px',
    maxWidth: '56px',
    maxHeight: '56px',
    minWidth: '56px',
    minHeight: '56px',
  },

  annex: {
    fontWeight: 400,
    color: theme.color.primary,
    textDecoration: 'none',
  },
});
