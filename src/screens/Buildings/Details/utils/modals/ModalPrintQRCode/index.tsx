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

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    position: 'relative',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  image: {
    width: '250px',
    height: '250px',
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    padding: '0 90px',
    textAlign: 'center',
    marginBottom: '70px',
    fontSize: '20px',
  },
  buildingName: {
    marginTop: '70px',
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

const PDF = ({ qrCodeDataUri, buildingName }: { qrCodeDataUri: any; buildingName: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src={image.backgroundForPDF} style={styles.backgroundImage} fixed />
      <View style={styles.wrapper}>
        <Image
          src="https://larguei.s3.us-west-2.amazonaws.com/image_3%201-1676404181033.png"
          style={styles.companyLogo}
        />

        <View style={styles.middle}>
          <Text style={styles.text}>
            A manutenção e o cuidado com o condomínio garantem a tranquilidade. Com o app Easy
            Alert, fica muito mais fácil mantê-lo em ordem!
          </Text>
          <Image src={qrCodeDataUri} style={styles.image} />
          <Text style={styles.buildingName}>{buildingName}</Text>
        </View>
        <Image src={image.logoForPDF} style={styles.easyAlertLogo} />
      </View>
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({ setModal, buildingName, buildingId }: IModalPrintQRCode) => {
  const [qrCodeBase64, setQrCodeBase64] = useState<any>();

  useEffect(() => {
    const qrCodeCanvas = document.querySelector('canvas');
    setQrCodeBase64(qrCodeCanvas?.toDataURL('image/png'));
  }, []);

  return (
    <Modal bodyWidth="60vw" title="QR Code para impressão" setModal={setModal}>
      <Style.Container>
        <QRCodeCanvas
          value={buildingId}
          style={{ display: 'none' }}
          size={500}
          bgColor="transparent"
        />

        <PDFViewer style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <PDF qrCodeDataUri={qrCodeBase64} buildingName={buildingName} />
        </PDFViewer>

        <PDFDownloadLink
          document={<PDF qrCodeDataUri={qrCodeBase64} buildingName={buildingName} />}
          fileName={`QR Code ${buildingName}`}
        >
          <Button label="Imprimir" />
        </PDFDownloadLink>
      </Style.Container>
    </Modal>
  );
};
