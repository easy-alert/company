// LIBS
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// COMPONENTS
import { Modal } from '../../../../../../components/Modal';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { Button } from '../../../../../../components/Buttons/Button';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const QRCodePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({ setModal, buildingName }: IModalPrintQRCode) => (
  <Modal bodyWidth="60vw" title="Cadastrar anexos" setModal={setModal}>
    <Style.Container>
      <PDFViewer style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <QRCodePDF />
      </PDFViewer>
      <PDFDownloadLink document={<QRCodePDF />} fileName={`QR Code ${buildingName}`}>
        <Button label="Imprimir" />
      </PDFDownloadLink>
    </Style.Container>
  </Modal>
);
