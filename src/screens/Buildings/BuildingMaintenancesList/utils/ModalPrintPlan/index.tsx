/* eslint-disable react/no-array-index-key */

// HOOKS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

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
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';

// TYPES
import { IModalPrintPlan } from './types';
import { AddedMaintenances } from '../types';

// STYLES
import * as Style from './styles';
import { theme } from '../../../../../styles/theme';

// FUNCTIONS
import { image } from '../../../../../assets/images';

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
    width: 100,
  },
  section2: {
    flexGrow: 1,
    width: 160,
  },
  section3: {
    flexGrow: 1,
    width: 55,
  },
  section4: {
    flexGrow: 1,
    width: 75,
  },
  section5: {
    flexGrow: 1,
    width: 70,
  },
  section6: {
    flexGrow: 1,
    width: 45,
  },
  section7: {
    flexGrow: 1,
    width: 50,
  },
  section8: {
    flexGrow: 1,
    width: 75,
  },
  section9: {
    flexGrow: 1,
    width: 60,
  },
  hr: {
    height: 0.5,
    backgroundColor: theme.color.gray5,
    width: '100%',
  },

  companyLogo: {
    height: 45,
    width: 89,
    objectFit: 'contain',
  },
  easyAlertLogo: {
    width: 77,
    height: 17,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  obs: {
    paddingBottom: 8,
    opacity: 0.7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    width: 700,
  },
  obsText: {
    flexGrow: 1,
  },
  name: {
    fontSize: 12,
  },
  categories: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  headerSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  headerSideRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
});

const MyDocument = ({
  setLoading,
  companyImage,
  categories,
}: {
  companyImage?: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  categories: AddedMaintenances[];
}) => (
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
            src={{
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
              },
              body: '',
              uri: companyImage ?? image.logoForPDF2,
            }}
            style={styles.companyLogo}
          />

          <View style={styles.headerSide}>
            <View style={styles.headerDiv}>
              <Text style={styles.name}>Plano de manutenção</Text>
            </View>

            <View style={styles.headerSideRow}>
              <View style={styles.headerDiv}>
                <Text>Edificação: {categories[0].Building.name}</Text>
              </View>

              <View style={styles.headerDiv}>
                <Text>Emissão: {new Date().toLocaleString('pt-BR')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categories}>
          {categories.map((category) => (
            <View key={category.Category.id}>
              <View wrap={false}>
                <Text style={styles.name}>{category.Category.name}</Text>
                <View style={styles.tableHeader}>
                  <View style={styles.section1}>
                    <Text>Elemento</Text>
                  </View>

                  <View style={styles.section2}>
                    <Text>Atividade</Text>
                  </View>

                  <View style={styles.section3}>
                    <Text>Periodicidade</Text>
                  </View>

                  <View style={styles.section4}>
                    <Text>Fonte</Text>
                  </View>

                  <View style={styles.section5}>
                    <Text>Prazo para execução</Text>
                  </View>

                  <View style={styles.section6}>
                    <Text>Antecedência</Text>
                  </View>

                  <View style={styles.section7}>
                    <Text>Última execução</Text>
                  </View>

                  {/* <View style={styles.section8}>
                    <Text>Última notificação</Text>
                  </View> */}

                  <View style={styles.section9}>
                    <Text>Próxima notificação</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tableBody}>
                {category.Maintenances.map((maintenance, i: number) => (
                  <View key={maintenance.Maintenance.element + i} wrap={false}>
                    <View style={styles.hr} />

                    <View style={styles.tableContent} key={maintenance.Maintenance.activity + i}>
                      <View style={styles.section1}>
                        <Text>{maintenance.Maintenance.element}</Text>
                      </View>
                      <View style={styles.section2}>
                        <Text>{maintenance.Maintenance.activity}</Text>
                      </View>
                      <View style={styles.section3}>
                        <Text>
                          A cada{' '}
                          {`${maintenance.Maintenance.frequency} ${
                            maintenance.Maintenance.frequency > 1
                              ? maintenance.Maintenance.FrequencyTimeInterval.pluralLabel
                              : maintenance.Maintenance.FrequencyTimeInterval.singularLabel
                          }`}
                        </Text>
                      </View>
                      <View style={styles.section4}>
                        <Text>{maintenance.Maintenance.source}</Text>
                      </View>
                      <View style={styles.section5}>
                        <Text>
                          {`${maintenance.Maintenance.period} ${
                            maintenance.Maintenance.period > 1
                              ? maintenance.Maintenance.PeriodTimeInterval.pluralLabel
                              : maintenance.Maintenance.PeriodTimeInterval.singularLabel
                          }`}
                        </Text>
                      </View>

                      <View style={styles.section6}>
                        <Text>
                          {maintenance.daysToAnticipate || '-'}

                          {!!maintenance.daysToAnticipate &&
                            maintenance.daysToAnticipate > 1 &&
                            ' dias'}

                          {!!maintenance.daysToAnticipate &&
                            maintenance.daysToAnticipate === 1 &&
                            ' dia'}
                        </Text>
                      </View>

                      <View style={styles.section7}>
                        <Text>{maintenance.Maintenance.lastResolutionDate ?? '-'}</Text>
                      </View>

                      {/* <View style={styles.section8}>
                        <Text>{maintenance.Maintenance.lastNotificationDate ?? '-'}</Text>
                      </View> */}
                      <View style={styles.section9}>
                        <Text>{maintenance.Maintenance.nextNotificationDate ?? '-'}</Text>
                      </View>
                    </View>
                  </View>
                ))}
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

export const ModalPrintPlan = ({ setModal, categories }: IModalPrintPlan) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useAuthContext();
  const companyImage = account?.Company?.image;

  return (
    <Modal bodyWidth="90vw" title="Plano de manutenção" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.Container>
          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            <MyDocument
              setLoading={setLoading}
              categories={categories}
              companyImage={companyImage}
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <MyDocument
                setLoading={setLoading}
                categories={categories}
                companyImage={companyImage}
              />
            }
            fileName={`Plano de manutenção - ${
              categories[0].Building.name
            } - ${new Date().toLocaleDateString('pt-BR')}`}
          >
            <Button label="Download" disable={loading} />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
