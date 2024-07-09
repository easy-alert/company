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
import { IModalPrintTickets } from './types';
import { ITicketsForPDF, IFilter } from '../types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../assets/images';

// FUNCTIONS
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { capitalizeFirstLetter, dateFormatter } from '../../../../utils/functions';
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
  ticketsForPDF,
  companyImage,
  filterforPDF,
  awaitingToFinishCount,
  finishedCount,
  openCount,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  ticketsForPDF: ITicketsForPDF[];
  companyImage: string;
  filterforPDF: IFilter;
  openCount: number;
  finishedCount: number;
  awaitingToFinishCount: number;
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
                {ticketsForPDF.map(({ data, month }) => (
                  <View style={Style.pdf.cardWrapper} key={month}>
                    <Text style={Style.pdf.month}>{month}</Text>
                    {data.map((ticket) => (
                      <View style={Style.pdf.cardRow} key={month} wrap={false}>
                        <View style={Style.pdf.cardDateColumn}>
                          <Text>
                            {String(new Date(ticket.createdAt).getDate()).padStart(2, '0')}
                          </Text>
                          <Text>
                            {capitalizeFirstLetter(
                              new Date(ticket.createdAt)
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
                              backgroundColor: ticket.status.backgroundColor,
                            }}
                          />

                          <View style={Style.pdf.content}>
                            <View style={Style.pdf.contentHeader}>
                              <Text>{ticket.building.name}</Text>

                              <View style={Style.pdf.tagsRow}>
                                <Text
                                  style={{
                                    ...Style.pdf.maintenanceTag,
                                    backgroundColor: ticket.status.backgroundColor,
                                  }}
                                >
                                  {ticket.status.label}
                                </Text>
                              </View>
                            </View>

                            <View style={Style.pdf.contentData}>
                              <View style={Style.pdf.contentColumn1}>
                                <Text style={Style.pdf.bold500}>
                                  Local da ocorrência:{' '}
                                  <Text style={Style.pdf.normal}>{ticket.place.label}</Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Tipo:{' '}
                                  <Text style={Style.pdf.normal}>
                                    {ticket.types.map(({ type }) => type.label).join(', ')}
                                  </Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Descrição:{' '}
                                  <Text style={Style.pdf.normal}>{ticket.description}</Text>
                                </Text>
                              </View>

                              <View style={Style.pdf.contentColumn2}>
                                <Text style={Style.pdf.bold500}>
                                  Data:{' '}
                                  <Text style={Style.pdf.normal}>
                                    {dateFormatter(ticket.createdAt)}
                                  </Text>
                                </Text>

                                <Text style={Style.pdf.bold500}>
                                  Morador:{' '}
                                  <Text style={Style.pdf.normal}>{ticket.residentName}</Text>
                                </Text>
                              </View>

                              <View style={Style.pdf.contentColumn3}>
                                <Text style={Style.pdf.bold500}>
                                  Imagens ({ticket.images.length}):
                                </Text>
                                <View style={Style.pdf.images}>
                                  {ticket.images.slice(0, 4).map(({ url }) => (
                                    <Link key={url} src={url} style={Style.pdf.image}>
                                      <Image
                                        source={url.endsWith('jpeg') ? image.imagePlaceholder : url}
                                      />
                                    </Link>
                                  ))}
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              <View style={Style.pdf.countCard} wrap={false}>
                <View>
                  <Text style={{ color: theme.color.success, fontSize: 12 }}>{finishedCount}</Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {finishedCount > 1 ? 'Finalizados' : 'Finalizado'}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: theme.color.primary, fontSize: 12 }}>{openCount}</Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {openCount > 1 ? 'Abertos' : 'Aberto'}
                  </Text>
                </View>

                <View>
                  <Text style={{ color: theme.color.warning, fontSize: 12 }}>
                    {awaitingToFinishCount}
                  </Text>
                  <Text style={{ color: theme.color.gray4, fontSize: 10 }}>
                    {awaitingToFinishCount > 1
                      ? 'Aguardando finalizações'
                      : 'Aguardando finalização'}
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
export const ModalPrintTickets = ({
  setModal,
  ticketsForPDF,
  filterforPDF,
  awaitingToFinishCount,
  finishedCount,
  openCount,
}: IModalPrintTickets) => {
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
              ticketsForPDF={ticketsForPDF}
              companyImage={account?.Company.image!}
              filterforPDF={filterforPDF}
              openCount={openCount}
              finishedCount={finishedCount}
              awaitingToFinishCount={awaitingToFinishCount}
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <MyDocument
                setLoading={setLoading}
                ticketsForPDF={ticketsForPDF}
                companyImage={account?.Company.image!}
                filterforPDF={filterforPDF}
                openCount={openCount}
                finishedCount={finishedCount}
                awaitingToFinishCount={awaitingToFinishCount}
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
