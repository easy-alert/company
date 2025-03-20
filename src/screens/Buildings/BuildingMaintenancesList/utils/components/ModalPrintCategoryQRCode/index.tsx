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
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// TYPES
import { IModalPrintCategoryQRCode } from './types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';
import { Select } from '../../../../../../components/Inputs/Select';

// #region PDF
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
  names: {
    textAlign: 'center',
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const MyDocument = ({
  companyImage,
  buildingName,
  categoryName,
  QRCodePNG,
  setLoading,
}: {
  companyImage: string;
  buildingName: string;
  categoryName: string;
  QRCodePNG: string;
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
      <PDFImage src={image.backgroundForPDF} style={styles.backgroundImage} fixed />
      {companyImage && (
        <PDFImage
          src={`${companyImage}?noCache=${Math.random().toString()}`}
          style={styles.companyLogo}
        />
      )}
      {/* <View style={styles.mainMessageView}>
        <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
      </View> */}
      <Text>{QRCodePNG && <PDFImage src={QRCodePNG} style={styles.QRCode} />}</Text>

      <View style={styles.names}>
        <Text style={styles.mainMessageView}>{buildingName}</Text>
        <Text style={styles.mainMessageView}>{categoryName}</Text>
      </View>
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
  names: {
    textAlign: 'center',
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const MyDocumentSquare = ({
  companyImage,
  buildingName,
  categoryName,
  QRCodePNG,
  setLoading,
}: {
  companyImage: string;
  buildingName: string;
  categoryName: string;
  QRCodePNG: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Document
    onRender={() => {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
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
      {/* <View style={stylesSquare.mainMessageView}>
        <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
      </View> */}
      <Text>{QRCodePNG && <PDFImage src={QRCodePNG} style={stylesSquare.QRCode} />}</Text>

      <View style={styles.names}>
        <Text style={styles.mainMessageView}>{buildingName}</Text>
        <Text style={styles.mainMessageView}>{categoryName}</Text>
      </View>
      <PDFImage src={image.logoForPDF} style={stylesSquare.easyAlertLogo} />
    </Page>
  </Document>
);
// #endregion

export const ModalPrintCategoryQRCode = ({
  setModal,
  buildingNanoId,
  buildingName,
  categoryName,
  categoryId,
}: IModalPrintCategoryQRCode) => {
  const { account } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(true);

  const [pdfSize, setPdfSize] = useState<'A4' | 'Quadrado'>('A4');

  const [QRCodePNG, setQRCodePNG] = useState<string>('');

  useEffect(() => {
    const canvas: any = document.getElementById('QRCode');
    const QRCodeURL = canvas.toDataURL('image/png');
    setQRCodePNG(QRCodeURL);
  }, []);

  return (
    <Modal bodyWidth="60vw" title="QR Code" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.HideQRCode>
          <QRCodeCanvas
            id="QRCode"
            value={`${
              import.meta.env.VITE_COMPANY_URL ?? 'http://localhost:3000'
            }/maintenances?buildingId=${buildingNanoId}&categoryId=${categoryId}`}
            bgColor="#F2EAEA"
            size={300}
          />
        </Style.HideQRCode>

        <Style.Container>
          <Select
            disabled={loading}
            label="Formato"
            style={{ maxWidth: '150px' }}
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
          <PDFViewer style={{ width: '100%', height: '60vh' }}>
            {pdfSize === 'A4' ? (
              <MyDocument
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
                categoryName={categoryName}
              />
            ) : (
              <MyDocumentSquare
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
                categoryName={categoryName}
              />
            )}
          </PDFViewer>
          <PDFDownloadLink
            document={
              pdfSize === 'A4' ? (
                <MyDocument
                  companyImage={account?.Company.image!}
                  buildingName={buildingName}
                  QRCodePNG={QRCodePNG}
                  setLoading={setLoading}
                  categoryName={categoryName}
                />
              ) : (
                <MyDocumentSquare
                  companyImage={account?.Company.image!}
                  buildingName={buildingName}
                  QRCodePNG={QRCodePNG}
                  setLoading={setLoading}
                  categoryName={categoryName}
                />
              )
            }
            fileName={`QR Code ${categoryName}`}
          >
            <Button label="Download" disable={loading} bgColor="primary" />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
