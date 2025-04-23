/* eslint-disable jsx-a11y/anchor-is-valid */
// #region imports
// COMPONENTS
import React, { useState } from 'react';
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
import { IModalPrintChecklists } from './types';
import { IChecklistsForPDF, IFilter } from '../types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../assets/images';

// FUNCTIONS
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { capitalizeFirstLetter, dateFormatter } from '../../../../utils/functions';
import {
  getStatusBackgroundColor,
  getSingularStatusNameforPdf,
} from '../../Maintenances/ModalPrintReport/functions';
import { theme } from '../../../../styles/theme';

Font.register({
  family: 'DMSans',
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
  checklistsForPDF,
  companyImage,
  filterforPDF,
  completedCount,
  pendingCount,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  checklistsForPDF: IChecklistsForPDF[];
  companyImage: string;
  filterforPDF: IFilter;
  pendingCount: number;
  completedCount: number;
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
                    {`${
                      filterforPDF.buildingNames.length
                        ? filterforPDF.buildingNames.join(', ')
                        : 'Todas'
                    }`}
                  </Text>

                  <Text>
                    <Text style={Style.pdf.bold500}>Status:</Text>{' '}
                    {`${
                      filterforPDF.statusNames.length
                        ? filterforPDF.statusNames.join(', ')
                        : 'Todos'
                    }`}
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
                {checklistsForPDF.map(({ data, month }) => (
                  <View style={Style.pdf.cardWrapper} key={month}>
                    <Text style={Style.pdf.month}>{month}</Text>
                    {data.map((checklist) => {
                      const allImages = [...checklist.images, ...checklist.detailImages];
                      const allImagesFiltered = allImages.slice(0, 4);

                      return (
                        <View style={Style.pdf.cardRow} key={month} wrap={false}>
                          <View style={Style.pdf.cardDateColumn}>
                            <Text>
                              {String(new Date(checklist.date).getDate()).padStart(2, '0')}
                            </Text>
                            <Text>
                              {capitalizeFirstLetter(
                                new Date(checklist.date)
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
                                backgroundColor: getStatusBackgroundColor(checklist.status),
                              }}
                            />

                            <View style={Style.pdf.content}>
                              <View style={Style.pdf.contentHeader}>
                                <Text>{checklist.building.name}</Text>

                                <View style={Style.pdf.tagsRow}>
                                  <Text
                                    style={{
                                      ...Style.pdf.maintenanceTag,
                                      backgroundColor: getStatusBackgroundColor(checklist.status),
                                    }}
                                  >
                                    {getSingularStatusNameforPdf(checklist.status)}
                                  </Text>
                                </View>
                              </View>

                              <View style={Style.pdf.contentData}>
                                <View style={Style.pdf.contentColumn1}>
                                  <Text style={Style.pdf.bold500}>
                                    Nome: <Text style={Style.pdf.normal}>{checklist.name}</Text>
                                  </Text>

                                  <Text style={Style.pdf.bold500}>
                                    Descrição:{' '}
                                    <Text style={Style.pdf.normal}>{checklist.description}</Text>
                                  </Text>
                                </View>

                                <View style={Style.pdf.contentColumn2}>
                                  <Text style={Style.pdf.bold500}>
                                    Data:{' '}
                                    <Text style={Style.pdf.normal}>
                                      {dateFormatter(checklist.date)}
                                    </Text>
                                  </Text>

                                  <Text style={Style.pdf.bold500}>
                                    Responsável:{' '}
                                    <Text style={Style.pdf.normal}>
                                      {checklist.syndic?.name || '-'}
                                    </Text>
                                  </Text>

                                  <Text style={Style.pdf.bold500}>
                                    Periodicidade:{' '}
                                    <Text style={Style.pdf.normal}>
                                      {checklist.frequency ? 'Sim' : 'Não'}
                                    </Text>
                                  </Text>
                                </View>

                                <View style={Style.pdf.contentColumn3}>
                                  <Text style={Style.pdf.bold500}>
                                    Imagens (
                                    {checklist.images.length + checklist.detailImages.length}
                                    ):
                                  </Text>
                                  <View style={Style.pdf.images}>
                                    {allImagesFiltered.map(({ url }) => (
                                      <Link key={url} src={url} style={Style.pdf.image}>
                                        <Image
                                          src={{
                                            uri: url,
                                            method: 'GET',
                                            headers: { 'Cache-Control': 'no-cache' },
                                            body: '',
                                          }}
                                        />
                                      </Link>
                                    ))}
                                  </View>
                                </View>
                              </View>
                              <Text style={Style.pdf.bold500}>
                                Observação do relato:{' '}
                                <Text style={Style.pdf.normal}>{checklist.observation || '-'}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={Style.pdf.countCard} wrap={false}>
                <View>
                  <Text style={{ color: theme.color.success, fontSize: 12 }}>{completedCount}</Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {completedCount > 1 ? 'Concluídas' : 'Concluída'}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: theme.color.warning, fontSize: 12 }}>{pendingCount}</Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {pendingCount > 1 ? 'Pendentes' : 'Pendente'}
                  </Text>
                </View>
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
export const ModalPrintChecklists = ({
  setModal,
  checklistsForPDF,
  filterforPDF,
  completedCount,
  pendingCount,
}: IModalPrintChecklists) => {
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
              checklistsForPDF={checklistsForPDF}
              companyImage={account?.Company.image!}
              filterforPDF={filterforPDF}
              completedCount={completedCount}
              pendingCount={pendingCount}
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <MyDocument
                setLoading={setLoading}
                checklistsForPDF={checklistsForPDF}
                companyImage={account?.Company.image!}
                filterforPDF={filterforPDF}
                completedCount={completedCount}
                pendingCount={pendingCount}
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
// #endregion
