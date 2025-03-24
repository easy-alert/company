// REACT
import { useEffect, useRef, useState } from 'react';

// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { ImageComponent } from '@components/ImageComponent';
import { CustomBackground } from '@components/CustomModal/CustomBackground';

// UTILS
import { applyMask, catchHandler } from '@utils/functions';

// ASSETS
import { icon } from '@assets/icons';
import IconUnlink from '@assets/icons/IconUnlink';
import IconLink from '@assets/icons/IconLink';

// GLOBAL TYPES
import type { ISupplier } from '@customTypes/ISupplier';

// COMPONENTS
import { ModalLinkSupplier } from './ModalLinkSupplier';
import { ModalCreateAndLinkSupplier } from './ModalCreateAndLinkSupplier';

// STYLES
import * as Style from './styles';

interface ILinkSupplierToMaintenanceHistory {
  maintenanceHistoryId: string;
}

export const LinkSupplierToMaintenanceHistory = ({
  maintenanceHistoryId,
}: ILinkSupplierToMaintenanceHistory) => {
  const ref = useRef<HTMLDivElement>(null);

  const [modalCreateAndLinkSupplierOpen, setModalCreateAndLinkSupplierOpen] = useState(false);
  const [modalLinkSupplierOpen, setModalLinkSupplierOpen] = useState(false);
  const [onQuery, setOnQuery] = useState(false);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const whatsappLink = (phone: string) => `https://api.whatsapp.com/send?phone=${phone}`;

  const findMaintenanceHistorySupplier = async () => {
    if (!maintenanceHistoryId) {
      setModalLinkSupplierOpen(false);
      toast.error('Erro ao buscar prestador de serviço vinculados.');
      return;
    }

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

      {modalLinkSupplierOpen && (
        <CustomBackground
          zIndex={19}
          onClick={() => {
            setModalLinkSupplierOpen(false);
          }}
        />
      )}

      {modalCreateAndLinkSupplierOpen && (
        <CustomBackground
          zIndex={21}
          onClick={() => {
            setModalCreateAndLinkSupplierOpen(false);
          }}
        />
      )}

      <Style.Container>
        {suppliers.length === 0 && (
          <Style.Header>
            <h3>Prestador de serviço</h3>

            <IconButton
              label="Vincular"
              icon={<IconLink strokeColor="white" backgroundColor="primary" padding="2px" />}
              permToCheck="maintenances:update"
              hideLabelOnMedia
              onClick={() => {
                ref.current?.scrollIntoView();
                setModalLinkSupplierOpen(true);
              }}
            />
          </Style.Header>
        )}

        {suppliers.length > 0 ? (
          suppliers.map(({ name, id, email, phone, image }, index) => (
            <Style.Container key={id} style={{ marginTop: index > 0 ? '8px' : '0px' }}>
              <Style.Header>
                <h3>Prestador de serviço</h3>

                <IconButton
                  label="Desvincular"
                  icon={<IconUnlink strokeColor="white" backgroundColor="primary" padding="2px" />}
                  permToCheck="maintenances:update"
                  hideLabelOnMedia
                  disabled={onQuery}
                  onClick={() => unlinkToMaintenanceHistory(id)}
                />
              </Style.Header>
              <Style.SupplierInfo>
                <ImageComponent src={image} size="32px" radius="100%" />

                <Style.ColumnInfo>
                  <p className="p2">{name}</p>
                  <div>
                    <ImageComponent src={icon.letter} size="16px" />
                    {email ? <a href={`mailto:${email}`}>{email}</a> : '-'}
                  </div>

                  <div>
                    <ImageComponent src={icon.whatsApp} size="16px" />
                    {phone ? (
                      <a href={whatsappLink(phone)} target="_blank" rel="noreferrer">
                        {applyMask({ mask: 'TEL', value: phone }).value}
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                </Style.ColumnInfo>
              </Style.SupplierInfo>
            </Style.Container>
          ))
        ) : (
          <p className="p2 opacity">Nenhum prestador de serviço vinculado.</p>
        )}
      </Style.Container>
    </>
  );
};
