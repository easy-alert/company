/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
// #region imports
// COMPONENTS
import React, { useEffect, useState } from 'react';
import {
  Page,
  Text,
  Document,
  View,
  PDFDownloadLink,
  PDFViewer,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';
import DMSansMedium from '../../../../assets/fonts/DM_Sans/DMSans-Medium.ttf';
import DMSansRegular from '../../../../assets/fonts/DM_Sans/DMSans-Regular.ttf';
import DMSansBold500 from '../../../../assets/fonts/DM_Sans/DMSans-Bold.ttf';

// TYPES
import { IModalPrintQRCode } from './types';
import { ICounts, IFilterforPDF, IMaintenanceForPDF } from '../types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../assets/images';

// FUNCTIONS
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { getImageBase64, getSingularStatusNameforPdf, getStatusBackgroundColor } from './functions';
import { applyMask, capitalizeFirstLetter, dateFormatter } from '../../../../utils/functions';
import { theme } from '../../../../styles/theme';

Font.register({
  family: 'DMSans',
  format: 'truetype',
  fonts: [
    {
      src: DMSansRegular,
    },
    {
      src: DMSansMedium,
      fontWeight: 500,
    },
    {
      src: DMSansBold500,
      fontWeight: 700,
    },
  ],
});
// #endregion

// #region pdf
const MyDocument = ({
  setLoading,
  maintenancesForPDF,
  companyImage,
  filterforPDF,
  counts,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maintenancesForPDF: IMaintenanceForPDF[];
  companyImage: string;
  filterforPDF: IFilterforPDF;
  counts: ICounts;
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
        setLoading(false);
      }}
    >
      <Page size="A4" style={Style.pdf.page} orientation="landscape">
        <View>
          {
            // #region Header
            <View fixed style={Style.pdf.header}>
              <View style={Style.pdf.headerSide}>
                <Image
                  src={`${companyImage}?noCache=${Math.random().toString()}`}
                  style={Style.pdf.companyLogo}
                />

                <View style={Style.pdf.headerColumn}>
                  <Text>
                    <Text style={Style.pdf.bold500}>Edificação:</Text>{' '}
                    {`${filterforPDF.buildingNames ? filterforPDF.buildingNames : 'Todas'}`}
                  </Text>

                  <Text>
                    <Text style={Style.pdf.bold500}>Categoria:</Text>{' '}
                    {`${filterforPDF.categoryNames ? filterforPDF.categoryNames : 'Todas'}`}
                  </Text>

                  <Text>
                    <Text style={Style.pdf.bold500}>Status:</Text>{' '}
                    {`${filterforPDF.statusNames ? filterforPDF.statusNames : 'Todos'}`}
                  </Text>

                  <Text>
                    <Text style={Style.pdf.bold500}>Período:</Text>{' '}
                    {filterforPDF.startDate && filterforPDF.endDate
                      ? `${new Date(
                          new Date(filterforPDF.startDate).setUTCHours(3, 0, 0, 0),
                        ).toLocaleDateString('pt-BR')} a ${new Date(
                          new Date(filterforPDF.endDate).setUTCHours(3, 0, 0, 0),
                        ).toLocaleDateString('pt-BR')}`
                      : 'Todos'}
                  </Text>
                </View>
              </View>

              <View style={Style.pdf.headerColumn}>
                <Text>
                  <Text style={Style.pdf.bold500}>ID:</Text> {randomNumber()}
                </Text>

                <Text>
                  <Text style={Style.pdf.bold500}>Emissão:</Text>{' '}
                  {new Date().toLocaleString('pt-BR')}
                </Text>
              </View>
            </View>
            // #endregion
          }

          {
            // #region Body
            <>
              <View style={Style.pdf.body}>
                {maintenancesForPDF.map(({ data, month }) => (
                  <View style={Style.pdf.cardWrapper} key={month}>
                    <Text style={Style.pdf.month}>{month}</Text>
                    {data.map((maintenance) => (
                      <View style={Style.pdf.cardRow} key={month} wrap={false}>
                        <View style={Style.pdf.cardDateColumn}>
                          <Text>
                            {String(new Date(maintenance.notificationDate).getDate()).padStart(
                              2,
                              '0',
                            )}
                          </Text>
                          <Text>
                            {capitalizeFirstLetter(
                              new Date(maintenance.notificationDate)
                                .toLocaleString('pt-br', {
                                  weekday: 'long',
                                })
                                .substring(0, 3),
                            )}
                          </Text>
                        </View>

                        <View style={Style.pdf.card}>
                          <View
                            style={{
                              ...Style.pdf.tag,
                              backgroundColor: getStatusBackgroundColor(
                                maintenance.status === 'overdue' ? 'completed' : maintenance.status,
                              ),
                            }}
                          />

                          <View style={Style.pdf.content}>
                            <View style={Style.pdf.contentHeader}>
                              <Text>{maintenance.buildingName}</Text>

                              <View style={Style.pdf.tagsRow}>
                                {maintenance.status === 'overdue' && (
                                  <Text
                                    style={{
                                      ...Style.pdf.maintenanceTag,
                                      backgroundColor: getStatusBackgroundColor('completed'),
                                    }}
                                  >
                                    {getSingularStatusNameforPdf('completed')}
                                  </Text>
                                )}
                                <Text
                                  style={{
                                    ...Style.pdf.maintenanceTag,
                                    backgroundColor: getStatusBackgroundColor(maintenance.status),
                                  }}
                                >
                                  {getSingularStatusNameforPdf(maintenance.status)}
                                </Text>

                                {maintenance.type === 'occasional' && (
                                  <Text
                                    style={{
                                      ...Style.pdf.maintenanceTag,
                                      backgroundColor: getStatusBackgroundColor('occasional'),
                                    }}
                                  >
                                    Avulsa
                                  </Text>
                                )}

                                {maintenance.inProgress && (
                                  <Text
                                    style={{
                                      ...Style.pdf.maintenanceTag,
                                      backgroundColor: getStatusBackgroundColor('inProgress'),
                                    }}
                                  >
                                    Em execução
                                  </Text>
                                )}
                              </View>
                            </View>

                            <View style={Style.pdf.contentData}>
                              <View style={Style.pdf.contentColumn1}>
                                <Text style={Style.pdf.bold500}>
                                  Categoria:{' '}
                                  <Text style={Style.pdf.normal}>{maintenance.categoryName}</Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Elemento:{' '}
                                  <Text style={Style.pdf.normal}>{maintenance.element}</Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Atividade:{' '}
                                  <Text style={Style.pdf.normal}>{maintenance.activity}</Text>
                                </Text>
                              </View>

                              <View style={Style.pdf.contentColumn2}>
                                <Text style={Style.pdf.bold500}>
                                  Notificação:{' '}
                                  <Text style={Style.pdf.normal}>
                                    {dateFormatter(maintenance.notificationDate)}
                                  </Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Conclusão:{' '}
                                  <Text style={Style.pdf.normal}>
                                    {maintenance.resolutionDate
                                      ? dateFormatter(maintenance.resolutionDate)
                                      : '-'}
                                  </Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Responsável:{' '}
                                  <Text style={Style.pdf.normal}>{maintenance.responsible}</Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Valor:{' '}
                                  <Text style={Style.pdf.normal}>
                                    {' '}
                                    {
                                      applyMask({
                                        value: String(maintenance.cost || 0),
                                        mask: 'BRL',
                                      }).value
                                    }
                                  </Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Anexos ({maintenance.annexes.length}):{' '}
                                  {maintenance.annexes.map(({ url, name }, annexIndex) => (
                                    <View key={url}>
                                      <Link src={url} style={Style.pdf.annex}>
                                        {`${name}${
                                          maintenance.annexes.length !== annexIndex + 1 ? ', ' : '.'
                                        }`}
                                      </Link>
                                    </View>
                                  ))}
                                </Text>
                              </View>

                              <View style={Style.pdf.contentColumn3}>
                                <Text style={Style.pdf.bold500}>
                                  Imagens ({maintenance.images.length}):
                                </Text>
                                <View style={Style.pdf.images}>
                                  {maintenance.images.slice(0, 4).map(({ url, base64 }) => (
                                    <Link key={url} src={url} style={Style.pdf.image}>
                                      <Image source={base64} />
                                    </Link>
                                  ))}
                                </View>
                              </View>
                            </View>
                            <Text style={{ ...Style.pdf.bold500, width: 750 }}>
                              Observação do relato:{' '}
                              <Text style={Style.pdf.normal}>
                                {maintenance.reportObservation || '-'}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              <View style={Style.pdf.countCard} wrap={false}>
                <View>
                  <Text style={{ color: theme.color.success, fontSize: 12 }}>
                    {counts.completed}
                  </Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {counts.completed > 1 ? 'Concluídas' : 'Concluída'}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: theme.color.warning, fontSize: 12 }}>{counts.pending}</Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {counts.pending > 1 ? 'Pendentes' : 'Pendente'}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: theme.color.actionDanger, fontSize: 12 }}>
                    {counts.expired}
                  </Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {counts.expired > 1 ? 'Vencidas' : 'Vencida'}
                  </Text>
                </View>

                <Text style={{ marginLeft: 'auto' }}>
                  Total: {applyMask({ value: String(counts.totalCost), mask: 'BRL' }).value}
                </Text>
              </View>
            </>
            // #endregion
          }
        </View>

        {
          // #region Footer
          <View fixed style={Style.pdf.footer}>
            <Image source={image.logoForPDF} style={Style.pdf.easyAlertLogo} />
            <Text
              render={({ pageNumber, totalPages }) => `${`Página ${pageNumber} de ${totalPages}`}`}
            />
          </View>
          // #endregion
        }
      </Page>
    </Document>
  );
};
// #endregion

// #region modal
export const ModalPrintReport = ({
  setModal,
  maintenancesForPDF,
  filterforPDF,
  counts,
  setMaintenancesForPDF,
}: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [base64Loading, setBase64Loading] = useState<boolean>(true);
  const { account } = useAuthContext();

  const createBase64Images = async () => {
    const maintenancesForPDFClone = structuredClone(maintenancesForPDF);

    for (let i = 0; i < maintenancesForPDFClone.length; i++) {
      const { data } = maintenancesForPDFClone[i];

      for (let j = 0; j < data.length; j++) {
        const { images } = data[j];

        for (let k = 0; k < images.length; k++) {
          const { url } = images[k];
          // eslint-disable-next-line no-await-in-loop
          const base64Url = await getImageBase64(url);
          images[k].base64 = base64Url || '';
        }
      }
    }

    setMaintenancesForPDF([...maintenancesForPDFClone]);
    setBase64Loading(false);
  };

  useEffect(() => {
    createBase64Images();
  }, []);

  return (
    <Modal bodyWidth="90vw" title="Relatório" setModal={setModal}>
      <>
        {(loading || base64Loading) && <Style.SmallLoading />}

        <Style.Container>
          {!base64Loading && (
            <>
              <PDFViewer style={{ width: '100%', height: '60vh' }}>
                <MyDocument
                  counts={counts}
                  setLoading={setLoading}
                  maintenancesForPDF={maintenancesForPDF}
                  companyImage={account?.Company.image!}
                  filterforPDF={filterforPDF}
                />
              </PDFViewer>
              <PDFDownloadLink
                document={
                  <MyDocument
                    counts={counts}
                    setLoading={setLoading}
                    maintenancesForPDF={maintenancesForPDF}
                    companyImage={account?.Company.image!}
                    filterforPDF={filterforPDF}
                  />
                }
                fileName={`Relatório ${new Date().toLocaleDateString('pt-BR')}`}
              >
                <Button label="Download" disable={loading} />
              </PDFDownloadLink>
            </>
          )}
        </Style.Container>
      </>
    </Modal>
  );
};
// #endregion
