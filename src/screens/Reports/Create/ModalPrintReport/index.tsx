/* eslint-disable react/no-array-index-key */
// COMPONENTS
import React, { useState } from 'react';
import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';

// TYPES
import { IModalPrintQRCode } from './types';

// STYLES
import * as Style from './styles';
import { IMaintenanceReport } from '../types';
import { theme } from '../../../../styles/theme';
import { applyMask, dateFormatter } from '../../../../utils/functions';
import { getStatusName } from '../../../Calendar/utils/EventTag/functions';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tableBody: {
    flexDirection: 'column',
    gap: 8,
  },
  tableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section1: {
    flexGrow: 1,
    fontSize: 8,
    width: 83,
  },
  section2: {
    flexGrow: 1,
    fontSize: 8,
    width: 83,
  },
  section3: {
    flexGrow: 1,
    fontSize: 8,
    width: 106,
  },
  section4: {
    flexGrow: 1,
    fontSize: 8,
    width: 106,
  },
  section5: {
    flexGrow: 1,
    fontSize: 8,
    width: 133,
  },
  section6: {
    flexGrow: 1,
    fontSize: 8,
    width: 133,
  },
  section7: {
    flexGrow: 1,
    fontSize: 8,
    width: 73,
  },
  section8: {
    flexGrow: 1,
    fontSize: 8,
    width: 63,
  },
  section9: {
    flexGrow: 1,
    fontSize: 8,
    width: 63,
  },
  hr: {
    height: 0.5,
    backgroundColor: theme.color.gray5,
    width: '100%',
  },
});

const MyDocument = ({
  setLoading,
  maintenances,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maintenances: IMaintenanceReport[];
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }}
  >
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.tableHeader}>
        <View style={styles.section1}>
          <Text>Data de notificação</Text>
        </View>

        <View style={styles.section2}>
          <Text>Data de resolução</Text>
        </View>
        <View style={styles.section3}>
          <Text>Edificação</Text>
        </View>

        <View style={styles.section4}>
          <Text>Categoria</Text>
        </View>

        <View style={styles.section5}>
          <Text>Elemento</Text>
        </View>

        <View style={styles.section6}>
          <Text>Atividade</Text>
        </View>

        <View style={styles.section7}>
          <Text>Responsável</Text>
        </View>

        <View style={styles.section8}>
          <Text>Status</Text>
        </View>

        <View style={styles.section9}>
          <Text>Valor</Text>
        </View>
      </View>

      <View style={styles.tableBody}>
        {maintenances.map((maintenance, i: number) => (
          <React.Fragment key={maintenance.activity + i}>
            <View style={styles.hr} />

            <View style={styles.tableContent} key={maintenance.activity + i}>
              <View style={styles.section1}>
                <Text>{dateFormatter(maintenance.notificationDate)}</Text>
              </View>
              <View style={styles.section2}>
                <Text>
                  {maintenance.resolutionDate ? dateFormatter(maintenance.resolutionDate) : '-'}
                </Text>
              </View>
              <View style={styles.section3}>
                <Text>{maintenance.buildingName}</Text>
              </View>
              <View style={styles.section4}>
                <Text>{maintenance.categoryName}</Text>
              </View>
              <View style={styles.section5}>
                <Text>{maintenance.element}</Text>
              </View>
              <View style={styles.section6}>
                <Text>{maintenance.activity}</Text>
              </View>
              <View style={styles.section7}>
                <Text>{maintenance.responsible ?? '-'}</Text>
              </View>
              <View style={styles.section8}>
                <Text>{getStatusName(maintenance.status)}</Text>
              </View>
              <View style={styles.section9}>
                <Text>
                  {maintenance.cost
                    ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                    : '-'}
                </Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </Page>
  </Document>
);

export const ModalPrintReport = ({ setModal, maintenances }: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <Modal bodyWidth="90vw" title="Relatório" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.Container>
          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            <MyDocument setLoading={setLoading} maintenances={maintenances} />
          </PDFViewer>
          <PDFDownloadLink
            document={<MyDocument setLoading={setLoading} maintenances={maintenances} />}
            fileName="Relatório nome"
          >
            <Button label="Download" disable={loading} />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
