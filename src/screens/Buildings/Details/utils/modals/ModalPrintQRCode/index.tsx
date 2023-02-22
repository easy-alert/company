// LIBS
import pdfMake from 'pdfmake/build/pdfmake';
import { useEffect, useState } from 'react';

// COMPONENTS
import { Modal } from '../../../../../../components/Modal';
import { Button } from '../../../../../../components/Buttons/Button';
import { useAuthContext } from '../../../../../../contexts/Auth/UseAuthContext';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';
import { manageClientUrl } from '../../functions';

pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

export const ModalPrintQRCode = ({ setModal, buildingName, buildingId }: IModalPrintQRCode) => {
  const { account } = useAuthContext();

  const [fakeLoading, setFakeLoading] = useState<boolean>(true);

  const docDefinition = {
    background: [{ image: 'background' }],

    header: {
      margin: [0, 40, 0, 0],
      image: 'companyLogo',
      fit: [196, 115],
    },

    content: [
      {
        margin: [0, 160, 0, 0],
        text: 'A manutenção e o cuidado com o condomínio garantem a tranquilidade. Com o app Easy Alert, fica muito mais fácil mantê-lo em ordem!',
      },
      {
        qr: manageClientUrl() + buildingId,
        background: '#F2EAEA',
        fit: 250,
        margin: [0, 68, 0, 68],
      },
      {
        text: buildingName,
        margin: [0, 0, 0, 90],
      },
      {
        image: 'easyAlertLogo',
        width: 169,
        height: 38,
      },
    ],

    defaultStyle: {
      alignment: 'center',
      fontSize: 22,
    },

    pageSize: 'A4',

    images: {
      easyAlertLogo: image.logoForPDF,
      background: image.backgroundForPDF,
      companyLogo: account?.Company.image,
    },
  };

  const createPdf = () => {
    const targetElement = document.querySelector('#iframeContainer');

    const iframe = document.createElement('iframe');

    const pdfDocGenerator = pdfMake.createPdf(docDefinition as any);

    pdfDocGenerator.getDataUrl((dataUrl) => {
      iframe.src = dataUrl;
    });

    targetElement?.appendChild(iframe);
  };

  const downloadPDF = () => {
    pdfMake.createPdf(docDefinition as any).download(`QR Code ${buildingName}`);
  };

  const printPDF = () => {
    pdfMake.createPdf(docDefinition as any).print();
  };

  useEffect(() => {
    createPdf();

    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal bodyWidth="60vw" title="QR Code para impressão" setModal={setModal}>
      <Style.Container>
        <Style.PDFContainer id="iframeContainer" />
        <Style.ButtonContainer>
          <Button disable={fakeLoading} label="Download" onClick={downloadPDF} />
          <Button disable={fakeLoading} label="Imprimir" onClick={printPDF} />
        </Style.ButtonContainer>
      </Style.Container>
    </Modal>
  );
};
