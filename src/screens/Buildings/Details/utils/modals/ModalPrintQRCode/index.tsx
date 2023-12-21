// COMPONENTS
import { useEffect, useState } from 'react';
import {
  Page,
  Text,
  Image as PDFImage,
  Document,
  PDFViewer,
  StyleSheet,
  View,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal } from '../../../../../../components/Modal';
import { Button } from '../../../../../../components/Buttons/Button';
import { useAuthContext } from '../../../../../../contexts/Auth/UseAuthContext';

// TYPES
import { IModalPrintQRCode } from './types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';
import { Select } from '../../../../../../components/Inputs/Select';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 0',
    position: 'relative',
  },
  easyAlertLogo: {
    width: 122,
    height: 27,
  },
  companyLogo: {
    height: 100,
    objectFit: 'contain,',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100vh',
    width: '100%',
  },
  mainMessageView: {
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  QRCode: {
    width: 270,
    height: 270,
  },
});

const MyDocument = ({
  companyImage,
  buildingName,
  QRCodePNG,
  setLoading,
  syndicName,
}: {
  companyImage: string;
  buildingName: string;
  QRCodePNG: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  syndicName: string | undefined;
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }}
  >
    <Page size="A4" style={styles.page}>
      <PDFImage src={image.backgroundForPDF} style={styles.backgroundImage} fixed />
      {companyImage && (
        <PDFImage
          src={`${companyImage}?noCache=${Math.random().toString()}`}
          style={styles.companyLogo}
        />
      )}
      <View style={styles.mainMessageView}>
        {syndicName ? (
          <Text>{syndicName}</Text>
        ) : (
          <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
        )}
      </View>
      <Text>{QRCodePNG && <PDFImage src={QRCodePNG} style={styles.QRCode} />}</Text>

      <Text style={styles.mainMessageView}>{buildingName}</Text>
      <PDFImage src={image.logoForPDF} style={styles.easyAlertLogo} />
    </Page>
  </Document>
);

const stylesSquare = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 0',
    position: 'relative',
  },
  easyAlertLogo: {
    width: 122,
    height: 27,
  },
  companyLogo: {
    height: 80,
    objectFit: 'contain',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100vh',
    width: '100%',
  },
  mainMessageView: {
    fontSize: 18,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  QRCode: {
    width: 200,
    height: 200,
  },
});

const MyDocumentSquare = ({
  companyImage,
  buildingName,
  QRCodePNG,
  setLoading,
  syndicName,
}: {
  companyImage: string;
  buildingName: string;
  QRCodePNG: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  syndicName: string | undefined;
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }}
  >
    <Page size={[595.28, 595.28]} style={stylesSquare.page}>
      <PDFImage src={image.backgroundForPDF} style={stylesSquare.backgroundImage} fixed />
      {companyImage && (
        <PDFImage
          src={`${companyImage}?noCache=${Math.random().toString()}`}
          style={stylesSquare.companyLogo}
        />
      )}
      <View style={stylesSquare.mainMessageView}>
        {syndicName ? (
          <Text>{syndicName}</Text>
        ) : (
          <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
        )}
      </View>
      <Text>{QRCodePNG && <PDFImage src={QRCodePNG} style={stylesSquare.QRCode} />}</Text>

      <Text style={stylesSquare.mainMessageView}>{buildingName}</Text>
      <PDFImage src={image.logoForPDF} style={stylesSquare.easyAlertLogo} />
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({
  setModal,
  buildingNanoId,
  buildingName,
  notificationsConfigurations,
}: IModalPrintQRCode) => {
  const { account } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(true);

  const [pdfSize, setPdfSize] = useState<'A4' | 'Quadrado'>('A4');
  const [syndicNanoId, setSyndicNanoId] = useState<string>('');

  const syndicName = notificationsConfigurations.find(
    ({ nanoId }) => syndicNanoId === nanoId,
  )?.name;

  const [QRCodePNG, setQRCodePNG] = useState<string>('');

  useEffect(() => {
    const canvas: any = document.getElementById('QRCode');
    const QRCodeURL = canvas.toDataURL('image/png');
    setQRCodePNG(QRCodeURL);
  }, [syndicNanoId]);

  return (
    <Modal bodyWidth="60vw" title="QR Code" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}
        <Style.HideQRCode>
          <QRCodeCanvas
            id="QRCode"
            value={
              syndicNanoId
                ? `${
                    import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001'
                  }/syndicarea/${buildingNanoId}?syndicNanoId=${syndicNanoId}}`
                : `${
                    import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001'
                  }/home/${buildingNanoId}}`
            }
            bgColor="#F2EAEA"
            size={300}
          />
        </Style.HideQRCode>

        <Style.Container>
          <Style.Selects>
            <Select
              disabled={loading}
              label="Formato"
              selectPlaceholderValue=" "
              value={pdfSize}
              onChange={(e) => {
                setLoading(true);
                setPdfSize(e.target.value as 'A4' | 'Quadrado');
              }}
            >
              <option value="A4">A4</option>
              <option value="Quadrado">Quadrado</option>
            </Select>

            <Select
              disabled={loading}
              label="Tipo"
              selectPlaceholderValue=" "
              value={syndicNanoId}
              onChange={(e) => {
                setSyndicNanoId(e.target.value);
              }}
            >
              <option value="">Morador</option>
              {notificationsConfigurations.map((syndic) => (
                <option key={syndic.nanoId} value={syndic.nanoId}>
                  {syndic.name}
                </option>
              ))}
            </Select>
          </Style.Selects>

          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            {pdfSize === 'A4' ? (
              <MyDocument
                syndicName={syndicName}
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
              />
            ) : (
              <MyDocumentSquare
                syndicName={syndicName}
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
              />
            )}
          </PDFViewer>
          <PDFDownloadLink
            document={
              pdfSize === 'A4' ? (
                <MyDocument
                  syndicName={syndicName}
                  companyImage={account?.Company.image!}
                  buildingName={buildingName}
                  QRCodePNG={QRCodePNG}
                  setLoading={setLoading}
                />
              ) : (
                <MyDocumentSquare
                  syndicName={syndicName}
                  companyImage={account?.Company.image!}
                  buildingName={buildingName}
                  QRCodePNG={QRCodePNG}
                  setLoading={setLoading}
                />
              )
            }
            fileName={`QR Code ${buildingName}`}
          >
            <Button label="Download" disable={loading} />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
