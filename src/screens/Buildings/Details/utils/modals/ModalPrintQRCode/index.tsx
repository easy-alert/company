// LIBS
import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// COMPONENTS
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal } from '../../../../../../components/Modal';
import { Button } from '../../../../../../components/Buttons/Button';
import { useAuthContext } from '../../../../../../contexts/Auth/UseAuthContext';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// FUNCTIONS
import { manageClientUrl } from '../../functions';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  qrCode: {
    width: '250px',
    height: '250px',
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    padding: '0 80px',
    textAlign: 'center',
    marginBottom: '70px',
    fontSize: '20px',
  },
  buildingName: {
    marginTop: '70px',
    fontSize: '20px',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: 0,
  },
  easyAlertLogo: {
    width: '186px',
    height: '42px',
  },
  companyLogo: {
    maxWidth: '200px',
    objectFit: 'contain',
  },
});

const PDF = ({
  qrCodePng,
  buildingName,
  companyImage,
  setLoading,
}: {
  qrCodePng: any;
  buildingName: string;
  companyImage: string;
  setLoading: any;
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }}
  >
    <Page size="A4" style={styles.page}>
      <Image src={image.backgroundForPDF} style={styles.backgroundImage} fixed />
      <View style={styles.wrapper}>
        <Image src={companyImage} style={styles.companyLogo} />

        <View style={styles.middle}>
          <Text style={styles.text}>
            A manutenção e o cuidado com o condomínio garantem a tranquilidade. Com o app Easy
            Alert, fica muito mais fácil mantê-lo em ordem!
          </Text>
          <Image src={qrCodePng} style={styles.qrCode} />
          <Text style={styles.buildingName}>{buildingName}</Text>
        </View>
        <Image src={image.logoForPDF} style={styles.easyAlertLogo} />
      </View>
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({ setModal, buildingName, buildingId }: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [qrCodePng, setQrCodePng] = useState<any>();
  const { account } = useAuthContext();

  useEffect(() => {
    const qrCodeCanvasSelector = document.querySelector('canvas');
    setQrCodePng(qrCodeCanvasSelector?.toDataURL('image/png'));
  }, []);

  return (
    <Modal bodyWidth="60vw" title="QR Code para impressão" setModal={setModal}>
      <Style.Container>
        <QRCodeCanvas
          value={manageClientUrl(window.location.origin) + buildingId}
          style={{ display: 'none' }}
          size={300}
          bgColor="transparent"
        />

        <PDFViewer style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <PDF
            qrCodePng={qrCodePng}
            buildingName={buildingName}
            companyImage={account?.Company.image!}
            setLoading={setLoading}
          />
        </PDFViewer>
        {!loading && (
          <PDFDownloadLink
            document={
              <PDF
                qrCodePng={qrCodePng}
                buildingName={buildingName}
                companyImage={account?.Company.image!}
                setLoading={setLoading}
              />
            }
            fileName={`QR Code ${buildingName}`}
          >
            <Button label="Imprimir" />
          </PDFDownloadLink>
        )}
      </Style.Container>
    </Modal>
  );
};
