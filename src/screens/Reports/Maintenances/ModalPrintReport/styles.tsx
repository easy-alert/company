import { StyleSheet } from '@react-pdf/renderer';
import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Container = styled.iframe`
  width: 100%;
  min-height: 70vh;
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
    gap: 8,
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
    width: '30px',
    justifyContent: 'center',
  },

  card: {
    display: 'flex',
    flexDirection: 'row',
  },

  tag: {
    width: '4px',
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

  tagsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },

  countCard: {
    marginLeft: 38,
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,

    padding: '12px',
    backgroundColor: `${theme.color.gray3}80`,
    borderRadius: '4px',
    fontWeight: 500,
  },
});
