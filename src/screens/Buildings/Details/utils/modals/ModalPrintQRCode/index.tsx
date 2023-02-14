// LIBS
import { Document, Page, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import QRCode from 'react-qr-code';

// COMPONENTS
import { Modal } from '../../../../../../components/Modal';
import { Button } from '../../../../../../components/Buttons/Button';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { theme } from '../../../../../../styles/theme';

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.color.white,
  },
});

const QRCodePDF = ({ buildingId }: { buildingId: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <QRCode value={buildingId} />
      </View>
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({ setModal, buildingName, buildingId }: IModalPrintQRCode) => (
  <Modal bodyWidth="60vw" title="QRcode para impressão" setModal={setModal}>
    <Style.Container>
      <QRCode value={buildingId} size={80} />

      <PDFViewer style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <QRCodePDF buildingId={buildingId} />
      </PDFViewer>
      <PDFDownloadLink
        document={<QRCodePDF buildingId={buildingId} />}
        fileName={`QR Code ${buildingName}`}
      >
        <Button label="Imprimir" />
      </PDFDownloadLink>
    </Style.Container>
  </Modal>
);
