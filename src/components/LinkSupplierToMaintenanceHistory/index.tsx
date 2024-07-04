import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { icon } from '../../assets/icons';
import { applyMask, catchHandler } from '../../utils/functions';
import { IconButton } from '../Buttons/IconButton';
import { ImageComponent } from '../ImageComponent';
import { ModalLinkSupplier } from './ModalLinkSupplier';
import * as Style from './styles';
import { Api } from '../../services/api';
import { ModalCreateAndLinkSupplier } from './ModalCreateAndLinkSupplier';

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
  const [modalCreateAndLinkSupplierOpen, setModalCreateAndLinkSupplierOpen] = useState(false);
  const [modalLinkSupplierOpen, setModalLinkSupplierOpen] = useState(false);
  const whatsappLink = (phone: string) => `https://api.whatsapp.com/send?phone=${phone}`;
  const ref = useRef<HTMLDivElement>(null);
  const [onQuery, setOnQuery] = useState(false);

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

  const unlinkToMaintenanceHistory = async (supplierId: string) => {
    setOnQuery(true);

    await Api.post(`/suppliers/unlink-to-maintenance-history`, {
      maintenanceHistoryId,
      supplierId,
    })
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        findMaintenanceHistorySupplier();
        setOnQuery(false);
      });
  };

  useEffect(() => {
    findMaintenanceHistorySupplier();
  }, []);

  return (
    <>
      {/* PRA SCROLLAR A TELA PRA CIMA QUANDO ABRIR A MODAL, PORQUE SE NAO APARECE FORA DA TELA */}
      <div ref={ref} style={{ position: 'absolute', top: '-10000px' }} />
      {modalLinkSupplierOpen && (
        <ModalLinkSupplier
          setModal={setModalLinkSupplierOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          findMaintenanceHistorySupplier={findMaintenanceHistorySupplier}
          setModalCreateAndLinkSupplierOpen={setModalCreateAndLinkSupplierOpen}
        />
      )}

      {modalCreateAndLinkSupplierOpen && (
        <ModalCreateAndLinkSupplier
          setModal={setModalCreateAndLinkSupplierOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          onThenRequest={async () => {
            await findMaintenanceHistorySupplier();
            setModalCreateAndLinkSupplierOpen(false);
            setModalLinkSupplierOpen(false);
          }}
        />
      )}

      {(modalLinkSupplierOpen || modalCreateAndLinkSupplierOpen) && (
        <Style.Background
          onClick={() => {
            if (modalCreateAndLinkSupplierOpen) {
              setModalCreateAndLinkSupplierOpen(false);
            } else {
              setModalLinkSupplierOpen(false);
            }
          }}
        />
      )}

      <Style.Container>
        {suppliers.length === 0 && (
          <Style.Header>
            <h6>Fornecedor</h6>
            <IconButton
              hideLabelOnMedia
              icon={icon.link}
              label="Vincular"
              onClick={() => {
                ref.current?.scrollIntoView();
                setModalLinkSupplierOpen(true);
              }}
            />
          </Style.Header>
        )}

        {suppliers.length > 0 ? (
          suppliers.map(({ name, id, email, phone }, index) => (
            <Style.Container key={id} style={{ marginTop: index > 0 ? '8px' : '0px' }}>
              <Style.Header>
                <h6>Fornecedor</h6>
                <IconButton
                  disabled={onQuery}
                  hideLabelOnMedia
                  icon={icon.unlink}
                  label="Desvincular"
                  onClick={() => {
                    unlinkToMaintenanceHistory(id);
                  }}
                />
              </Style.Header>
              <Style.SupplierInfo>
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
            </Style.Container>
          ))
        ) : (
          <p className="p2 opacity">Nenhum fornecedor vinculado.</p>
        )}
      </Style.Container>
    </>
  );
};
