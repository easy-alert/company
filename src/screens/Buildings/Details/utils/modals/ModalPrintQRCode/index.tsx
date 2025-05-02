// REACT
import { useEffect, useState, useCallback } from 'react';

// LIBS
import ReactPDF, {
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

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useUsersForSelect } from '@hooks/useUsersForSelect';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { Select } from '@components/Inputs/Select';

// GLOBAL ASSETS
import { image } from '@assets/images';

// STYLES
import * as Style from './styles';

// TYPES
import { IModalPrintQRCode } from './types';

// Definindo tipos
interface MyDocumentProps {
  companyImage: string;
  buildingName: string;
  QRCodePNG: string;
  syndicName: string | undefined;
  setLoading: (loadState: boolean) => void;
  isSquare: boolean;
}

const defaultPDFStyles: ReactPDF.Styles = {
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
  backgroundImage: {
    position: 'absolute',
    height: '100vh',
    width: '100%',
  },
};

const styles = StyleSheet.create<any>({
  ...defaultPDFStyles,
  companyLogo: {
    height: 100,
    objectFit: 'contain',
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

const stylesSquare = StyleSheet.create<any>({
  ...defaultPDFStyles,
  companyLogo: {
    height: 80,
    objectFit: 'contain',
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

const MyDocument = ({
  companyImage,
  buildingName,
  QRCodePNG,
  setLoading,
  syndicName,
  isSquare,
}: MyDocumentProps) => (
  <Document onRender={() => setLoading(false)}>
    <Page
      size={isSquare ? [595.28, 595.28] : 'A4'}
      style={isSquare ? stylesSquare.page : styles.page}
    >
      <PDFImage
        src={image.backgroundForPDF}
        style={isSquare ? stylesSquare.backgroundImage : styles.backgroundImage}
        fixed
      />
      {companyImage && (
        <PDFImage
          src={`${companyImage}?noCache=${Math.random().toString()}`}
          style={isSquare ? stylesSquare.companyLogo : styles.companyLogo}
        />
      )}
      <View style={isSquare ? stylesSquare.mainMessageView : styles.mainMessageView}>
        {syndicName ? (
          <Text>{syndicName}</Text>
        ) : (
          <Text>Acompanhe as manutenções do seu condomínio aqui!</Text>
        )}
      </View>
      <Text>
        {QRCodePNG && (
          <PDFImage src={QRCodePNG} style={isSquare ? stylesSquare.QRCode : styles.QRCode} />
        )}
      </Text>

      <Text style={isSquare ? stylesSquare.mainMessageView : styles.mainMessageView}>
        {buildingName}
      </Text>
      <PDFImage
        src={image.logoForPDF}
        style={isSquare ? stylesSquare.easyAlertLogo : styles.easyAlertLogo}
      />
    </Page>
  </Document>
);

export const ModalPrintQRCode = ({
  setModal,
  buildingId,
  buildingName,
  buildingImage,
}: IModalPrintQRCode) => {
  const { account } = useAuthContext();

  const { usersForSelect } = useUsersForSelect({
    buildingId,
    checkPerms: false,
  });

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  }>({
    id: '',
    name: '',
  });

  const [pdfSize, setPdfSize] = useState<'A4' | 'Quadrado'>('A4');
  const [QRCodePNG, setQRCodePNG] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const updateLoadingState = useCallback((value: boolean) => {
    setLoading(value);
  }, []);

  useEffect(() => {
    const canvas: any = document.getElementById('QRCode');
    const QRCodeURL = canvas.toDataURL('image/png');

    setQRCodePNG(QRCodeURL);
  }, [selectedUser]);

  return (
    <Modal bodyWidth="60vw" title="QR Code" setModal={setModal}>
      <>
        {loading && <Style.SmallLoading />}

        <Style.HideQRCode>
          <QRCodeCanvas
            id="QRCode"
            value={`${
              import.meta.env.VITE_COMPANY_URL ?? 'http://localhost:3000'
            }/maintenances?buildingId=${buildingId}`}
            bgColor="#F2EAEA"
            size={300}
          />
        </Style.HideQRCode>

        <Style.Container>
          <Style.Selects>
            <Select
              arrowColor="primary"
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
              arrowColor="primary"
              disabled={loading}
              label="Tipo"
              selectPlaceholderValue=" "
              value={selectedUser.id}
              onChange={(e) => {
                setLoading(true);
                setSelectedUser({
                  id: e.target.value,
                  name: e.target.options[e.target.selectedIndex].text,
                });
              }}
            >
              <option value="">Morador</option>

              {usersForSelect.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </Style.Selects>

          <div style={{ width: '100%', height: '60vh' }}>
            {!loading && (
              <PDFViewer style={{ width: '100%', height: '60vh' }}>
                <MyDocument
                  isSquare={pdfSize !== 'A4'}
                  syndicName={selectedUser.name}
                  companyImage={buildingImage ?? account?.Company.image!}
                  buildingName={buildingName}
                  QRCodePNG={QRCodePNG}
                  setLoading={updateLoadingState}
                />
              </PDFViewer>
            )}
          </div>
          <PDFDownloadLink
            document={
              <MyDocument
                isSquare={pdfSize !== 'A4'}
                syndicName={selectedUser.name}
                companyImage={account?.Company.image!}
                buildingName={buildingName}
                QRCodePNG={QRCodePNG}
                setLoading={setLoading}
              />
            }
            fileName={`QR Code ${buildingName}`}
          >
            <Button label="Download" disable={loading} bgColor="primary" />
          </PDFDownloadLink>
        </Style.Container>
      </>
    </Modal>
  );
};
