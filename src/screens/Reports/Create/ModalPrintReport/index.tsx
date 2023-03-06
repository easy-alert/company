// COMPONENTS
import { useState } from 'react';
import { Page, Text, Document, StyleSheet, View, PDFDownloadLink } from '@react-pdf/renderer';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';

// TYPES
import { IModalPrintQRCode } from './types';

// STYLES
import * as Style from './styles';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 0',
    position: 'relative',
  },
});

const MyDocument = ({
  setLoading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }}
  >
    <Page size="A4" style={styles.page}>
      <View>
        <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
      </View>
    </Page>
  </Document>
);

export const ModalPrintReport = ({ setModal, buildingName }: IModalPrintQRCode) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <Modal bodyWidth="80vw" title="Relatório" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.Container>
          <MyDocument setLoading={setLoading} />
          <PDFDownloadLink
            document={<MyDocument setLoading={setLoading} />}
            fileName={`Relatório ${buildingName}`}
          >
            <Button label="Download" disable={loading} />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
