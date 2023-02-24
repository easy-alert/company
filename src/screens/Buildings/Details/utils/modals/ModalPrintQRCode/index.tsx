// COMPONENTS
import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactToPrint from 'react-to-print';
import { Modal } from '../../../../../../components/Modal';
import { useAuthContext } from '../../../../../../contexts/Auth/UseAuthContext';
import { Image } from '../../../../../../components/Image';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';
import { image } from '../../../../../../assets/images';
import { Button } from '../../../../../../components/Buttons/Button';

export const ModalPrintQRCode = ({ setModal, buildingName, buildingId }: IModalPrintQRCode) => {
  const { account } = useAuthContext();
  const componentRef = useRef(null);
  return (
    <Modal bodyWidth="60vw" title="QR Code para impressão" setModal={setModal}>
      <>
        <Style.Container ref={componentRef}>
          <img src={account?.Company.image} alt="" />
          <Style.Middle>
            <h2>
              A manutenção e o cuidado com o condomínio garantem a tranquilidade. Com o app Easy
              Alert, fica muito mais fácil mantê-lo em ordem!
            </h2>
            <QRCodeSVG
              value={
                (import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001/maintenancesplan/') +
                buildingId
              }
              bgColor="#F2EAEA"
              size={300}
            />
            <h2>{buildingName}</h2>
          </Style.Middle>
          <Image img={image.logoForPDF} width="212px" height="48px" radius="0" />
        </Style.Container>
        <ReactToPrint
          // eslint-disable-next-line react/no-unstable-nested-components
          trigger={() => <Button style={{ marginTop: '16px' }} label="Imprimir" center />}
          content={() => componentRef.current}
          documentTitle={`QR Code ${buildingName}`}
        />
      </>
    </Modal>
  );
};
