/* eslint-disable react/no-array-index-key */
// COMPONENTS
import React, { useState } from 'react';
import { Page, Text, Document, View, PDFDownloadLink, PDFViewer, Image } from '@react-pdf/renderer';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';

// TYPES
import { IModalPrintQRCode } from './types';
import { IFilterforPDF, IMaintenanceReportData } from '../types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../assets/images';

// FUNCTIONS
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';

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
  console.log(maintenances);

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
      <Page size="A4" style={Style.pdf.page} orientation="landscape">
        <View>
          <View fixed style={Style.pdf.header}>
            <View style={Style.pdf.headerSide}>
              <Image
                src={`${companyImage}?noCache=${Math.random().toString()}`}
                style={Style.pdf.companyLogo}
              />

              <View>
                <Text>
                  Edificação:{' '}
                  {`${filterforPDF.buildingNames ? filterforPDF.buildingNames : 'Todas'}`}
                </Text>
                <Text>
                  Status: {`${filterforPDF.statusNames ? filterforPDF.statusNames : 'Todos'}`}
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

                <Text>
                  Categoria:{' '}
                  {`${filterforPDF.categoryNames ? filterforPDF.categoryNames : 'Todas'}`}
                </Text>
              </View>
            </View>
            <View>
              <Text>Emissão: {new Date().toLocaleString('pt-BR')}</Text>
              <Text>ID: {randomNumber()}</Text>
            </View>
          </View>
        </View>

        <View fixed style={Style.pdf.footer}>
          <Image source={image.logoForPDF} style={Style.pdf.easyAlertLogo} />
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
