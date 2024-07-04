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

interface ISupplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
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

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const findMaintenanceHistorySupplier = async () => {
    await Api.get(`/suppliers/selected/${maintenanceHistoryId}`)
      .then((res) => {
        setSuppliers(res.data.suppliers);
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
          findMaintenanceHistorySupplier={findMaintenanceHistorySupplier}
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
            icon={suppliers.length > 0 ? icon.unlink : icon.link}
            label={suppliers.length > 0 ? 'Desvincular' : 'Vincular'}
            onClick={() => {
              ref.current?.scrollIntoView();
              setModalLinkSupplierOpen(true);
            }}
          />
        </Style.Header>
        {suppliers.length > 0 ? (
          suppliers.map(({ name, id, email, phone }, index) => (
            <Style.SupplierInfo key={id} style={{ marginTop: index > 0 ? '8px' : '0px' }}>
              <p className="p2">{name}</p>
              <div>
                <ImageComponent src={icon.letter} size="16px" />
                {email ? <a href="mailto:email@provedor.com.br">email@email.com</a> : '-'}
              </div>

              <div>
                <ImageComponent src={icon.whatsApp} size="16px" />
                {phone ? (
                  <a href={whatsappLink('48999283494')} target="_blank" rel="noreferrer">
                    {applyMask({ mask: 'TEL', value: '48999283494' }).value}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </Style.SupplierInfo>
          ))
        ) : (
          <p className="p2 opacity">Nenhum fornecedor vinculado.</p>
        )}
      </Style.Container>
    </>
  );
};
