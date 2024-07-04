import { useRef, useState } from 'react';
import { icon } from '../../assets/icons';
import { applyMask } from '../../utils/functions';
import { IconButton } from '../Buttons/IconButton';
import { ImageComponent } from '../ImageComponent';
import { ModalLinkSupplier } from './ModalLinkSupplier';
import * as Style from './styles';

interface ILinkSupplierToMaintenanceHistory {
  maintenanceHistoryId: string;
}

export const LinkSupplierToMaintenanceHistory = ({
  maintenanceHistoryId,
}: ILinkSupplierToMaintenanceHistory) => {
  const [modalLinkSupplierOpen, setModalLinkSupplierOpen] = useState(false);
  const whatsappLink = (phone: string) => `https://api.whatsapp.com/send?phone=${phone}`;
  const ref = useRef<HTMLDivElement>(null);

  const hasSupplier = false;
  // eslint-disable-next-line no-console
  console.log(maintenanceHistoryId);

  return (
    <>
      <div ref={ref} style={{ position: 'absolute', top: '-10000px' }} />
      {modalLinkSupplierOpen && <ModalLinkSupplier setModal={setModalLinkSupplierOpen} />}
      {modalLinkSupplierOpen && (
        <Style.Background
          onClick={() => {
            setModalLinkSupplierOpen(false);
          }}
        />
      )}

      <Style.Container>
        <Style.Header>
          <h6>Fornecedor</h6>
          <IconButton
            hideLabelOnMedia
            icon={hasSupplier ? icon.unlink : icon.link}
            label={hasSupplier ? 'Desvincular' : 'Vincular'}
            onClick={() => {
              ref.current?.scrollIntoView();
              setModalLinkSupplierOpen(true);
            }}
          />
        </Style.Header>
        {!hasSupplier && <p className="p2 opacity">Nenhum fornecedor vinculado.</p>}
        {hasSupplier && (
          <Style.SupplierInfo>
            <p className="p2">Nome do fornecedor</p>
            <div>
              <ImageComponent src={icon.letter} size="16px" />
              <a href="mailto:email@provedor.com.br">email@email.com</a>
            </div>

            <div>
              <ImageComponent src={icon.whatsApp} size="16px" />
              <a href={whatsappLink('48999283494')} target="_blank" rel="noreferrer">
                {applyMask({ mask: 'TEL', value: '48999283494' }).value}
              </a>
            </div>
          </Style.SupplierInfo>
        )}
      </Style.Container>
    </>
  );
};
