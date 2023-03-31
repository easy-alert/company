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
  Image,
} from '@react-pdf/renderer';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';

// TYPES
import { IModalPrintQRCode } from './types';
import { IFilterforPDF, IMaintenanceReportData } from '../types';

// STYLES
import * as Style from './styles';
import { theme } from '../../../../styles/theme';
import { image } from '../../../../assets/images';

// FUNCTIONS
import { applyMask, dateFormatter } from '../../../../utils/functions';
import { getStatusName } from '../../../Calendar/utils/EventTag/functions';
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { getStatusNameforPdf } from './functions';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
    fontSize: 8,
    color: theme.color.gray5,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    padding: '8px 0',
    gap: '0 8px',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px 0',
    gap: '0 8px',
  },
  section1: {
    flexGrow: 1,
    width: 83,
  },
  section2: {
    flexGrow: 1,
    width: 83,
  },
  section3: {
    flexGrow: 1,
    width: 80,
  },
  section4: {
    flexGrow: 1,
    width: 100,
  },
  section5: {
    flexGrow: 1,
    width: 130,
  },
  section6: {
    flexGrow: 1,
    width: 120,
  },
  section7: {
    flexGrow: 1,
    width: 80,
  },
  section8: {
    flexGrow: 1,
    width: 63,
  },
  section9: {
    flexGrow: 1,
    width: 63,
  },
  hr: {
    height: 0.5,
    backgroundColor: theme.color.gray5,
    width: '100%',
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
    justifyContent: 'flex-start',
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
  footer: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const MyDocument = ({
  setLoading,
  maintenances,
  companyImage,
  filterforPDF,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maintenances: IMaintenanceReportData[];
  companyImage: string;
  filterforPDF: IFilterforPDF;
}) => {
  const randomNumber = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;

    for (let i = 0; i < 9; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  return (
    <Document
      onRender={() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }}
    >
      <Page size="A4" style={styles.page} orientation="landscape">
        <View>
          <View fixed style={styles.header}>
            <Image
              src={`${companyImage}?noCache=${Math.random().toString()}`}
              style={styles.companyLogo}
            />
            <View style={styles.headerDiv}>
              <Text>
                Edificação: {`${filterforPDF.buildingName ? filterforPDF.buildingName : 'Todas'}`}
              </Text>
              <Text>ID: {randomNumber()}</Text>
            </View>
            <View style={styles.headerDiv}>
              <Text>
                Categoria: {`${filterforPDF.categoryName ? filterforPDF.categoryName : 'Todas'}`}
              </Text>
              <Text>
                Período:{' '}
                {filterforPDF.startDate && filterforPDF.endDate
                  ? `${new Date(
                      new Date(filterforPDF.startDate).setUTCHours(3, 0, 0, 0),
                    ).toLocaleDateString('pt-BR')} a ${new Date(
                      new Date(filterforPDF.endDate).setUTCHours(3, 0, 0, 0),
                    ).toLocaleDateString('pt-BR')}`
                  : 'Todos'}
              </Text>
            </View>
            <View style={styles.headerDiv}>
              <Text>
                Status: {`${filterforPDF.status ? getStatusName(filterforPDF.status) : 'Todos'}`}
              </Text>
              <Text>Emissão: {new Date().toLocaleString('pt-BR')}</Text>
            </View>
          </View>
          <View style={styles.tableHeader} fixed>
            <View style={styles.section1}>
              <Text>Data de notificação</Text>
            </View>

            <View style={styles.section2}>
              <Text>Data de conclusão</Text>
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
              <View key={maintenance.activity + i} wrap={false}>
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
                    <Text>{maintenance.responsible}</Text>
                  </View>
                  <View style={styles.section8}>
                    <Text>{getStatusNameforPdf(maintenance.status)}</Text>
                  </View>
                  <View style={styles.section9}>
                    <Text>
                      {maintenance.cost
                        ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                        : '-'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View fixed style={styles.footer}>
          <Image source={image.logoForPDF} style={styles.easyAlertLogo} />
          <Text
            render={({ pageNumber, totalPages }) => `${`Página ${pageNumber} de ${totalPages}`}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export const ModalPrintReport = ({ setModal, maintenances, filterforPDF }: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useAuthContext();

  return (
    <Modal bodyWidth="90vw" title="Relatório" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.Container>
          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            <MyDocument
              setLoading={setLoading}
              maintenances={maintenances}
              companyImage={account?.Company.image!}
              filterforPDF={filterforPDF}
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <MyDocument
                setLoading={setLoading}
                maintenances={maintenances}
                companyImage={account?.Company.image!}
                filterforPDF={filterforPDF}
              />
            }
            fileName={`Relatório ${new Date().toLocaleDateString('pt-BR')}`}
          >
            <Button label="Download" disable={loading} />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
