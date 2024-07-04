import { useEffect, useRef, useState } from 'react';
import { icon } from '../../assets/icons';
import { applyMask, catchHandler } from '../../utils/functions';
import { IconButton } from '../Buttons/IconButton';
import { ImageComponent } from '../ImageComponent';
import { ModalLinkSupplier } from './ModalLinkSupplier';
import * as Style from './styles';
import { Api } from '../../services/api';

interface ILinkSupplierToMaintenanceHistory {
  maintenanceHistoryId: string;
}

export interface ISupplier {
  id: string;
  image: string;
  name: string;
  state: string;
  city: string;
  cnpj: string;

  phone: string | null;
  email: string | null;
  link: string | null;

  serviceTypes: {
    type: { label: string };
  }[];
}

export const LinkSupplierToMaintenanceHistory = ({
  maintenanceHistoryId,
}: ILinkSupplierToMaintenanceHistory) => {
  const [modalLinkSupplierOpen, setModalLinkSupplierOpen] = useState(false);
  const whatsappLink = (phone: string) => `https://api.whatsapp.com/send?phone=${phone}`;
  const ref = useRef<HTMLDivElement>(null);

  const [supplier, setSupplier] = useState<ISupplier>();

  const findMaintenanceHistorySupplier = async () => {
    await Api.get(`/suppliers/maintenance-history/${maintenanceHistoryId}`)
      .then((res) => {
        console.log(res.data);
        setSupplier(res.data.supplier);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    findMaintenanceHistorySupplier();
  }, []);

  return (
    <>
      <div ref={ref} style={{ position: 'absolute', top: '-10000px' }} />
      {modalLinkSupplierOpen && (
        <ModalLinkSupplier
          setModal={setModalLinkSupplierOpen}
          maintenanceHistoryId={maintenanceHistoryId}
        />
      )}
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
            icon={supplier ? icon.unlink : icon.link}
            label={supplier ? 'Desvincular' : 'Vincular'}
            onClick={() => {
              ref.current?.scrollIntoView();
              setModalLinkSupplierOpen(true);
            }}
          />
        </Style.Header>
        {!supplier && <p className="p2 opacity">Nenhum fornecedor vinculado.</p>}
        {supplier && (
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
