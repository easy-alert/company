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
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';

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
    width: 212,
    height: 48,
  },
  companyLogo: {
    height: 100,
    objectFit: 'contain,',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100vh',
  },
  mainMessageView: {
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  QRCode: {
    width: 280,
    height: 280,
  },
});

const MyDocument = ({
  companyImage,
  buildingName,
  QRCodePNG,
  setLoading,
}: {
  companyImage: string;
  buildingName: string;
  QRCodePNG: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Document
    onRender={() => {
      setLoading(false);
    }}
  >
    <Page size="A4" style={styles.page}>
      <PDFImage src={image.backgroundForPDF} style={styles.backgroundImage} fixed />
      {companyImage ? (
        <PDFImage src={companyImage} style={styles.companyLogo} />
      ) : (
        <PDFImage src={image.logoForPDF} style={styles.easyAlertLogo} />
      )}
      <View style={styles.mainMessageView}>
        <Text>A manutenção e o cuidado com o condomínio</Text>
        <Text>garantem a tranquilidade. Com o app Easy Alert, fica</Text>
        <Text>muito mais fácil mantê-lo em ordem!</Text>
      </View>
      {QRCodePNG ? (
        <PDFImage src={QRCodePNG} style={styles.QRCode} />
      ) : (
        <PDFImage src={image.logoForPDF} style={styles.easyAlertLogo} />
      )}

      <Text>{buildingName}</Text>
      <PDFImage src={image.logoForPDF} style={styles.easyAlertLogo} />
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({ setModal, buildingId, buildingName }: IModalPrintQRCode) => {
  const { account } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(true);

  const [QRCodePNG, setQRCodePNG] = useState<string>('');

  useEffect(() => {
    const canvas: any = document.getElementById('QRCode');
    const teste = canvas.toDataURL('image/png');
    setQRCodePNG(teste);
  }, []);

  return (
    <Modal bodyWidth="60vw" title="QR Code" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}
        <Style.HideQRCode>
          <QRCodeCanvas
            id="QRCode"
            value={`${
              import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001/maintenancesplan'
            }/${buildingId}`}
            bgColor="#F2EAEA"
            size={300}
          />
        </Style.HideQRCode>

        <Style.Container>
          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            <MyDocument
              companyImage={account?.Company.image!}
              buildingName={buildingName}
              QRCodePNG={QRCodePNG}
              setLoading={setLoading}
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <MyDocument
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
              />
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
