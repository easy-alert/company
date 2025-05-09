// REACT
import { useEffect, useState } from 'react';

// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { CustomModal } from '@components/CustomModal';

// UTILS
import { catchHandler } from '@utils/functions';

// GLOBAL TYPES
import type { ISupplier } from '@customTypes/ISupplier';

// STYLES
import * as Style from './styles';

interface IModalLinkSupplier {
  maintenanceHistoryId: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  findMaintenanceHistorySupplier: () => Promise<void>;
  setModalCreateAndLinkSupplierOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalLinkSupplier = ({
  maintenanceHistoryId,
  setModal,
  findMaintenanceHistorySupplier,
  setModalCreateAndLinkSupplierOpen,
}: IModalLinkSupplier) => {
  const [suggestedSuppliers, setSuggestedSuppliers] = useState<ISupplier[]>([]);
  const [remainingSuppliers, setRemainingSuppliers] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [onQuery, setOnQuery] = useState(false);

  // tirar o delete many no linkWithMaintenanceHistory se for vincular a mais de 1 fornecedor
  const findCompanySuppliers = async () => {
    if (!maintenanceHistoryId) {
      setModal(false);
      toast.error('Erro ao buscar prestadores de serviço. Tente novamente.');
      return;
    }

    await Api.get(`/suppliers/to-select/${maintenanceHistoryId}`)
      .then((res) => {
        setRemainingSuppliers(res.data.remainingSuppliers);
        setSuggestedSuppliers(res.data.suggestedSuppliers);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const linkToMaintenanceHistory = async (supplierId: string) => {
    setOnQuery(true);

    await Api.post(`/suppliers/link-to-maintenance-history`, {
      maintenanceHistoryId,
      supplierId,
    })
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
        findCompanySuppliers();
        findMaintenanceHistorySupplier();
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  useEffect(() => {
    findCompanySuppliers();
  }, []);

  return (
    <CustomModal
      setModal={setModal}
      title="Vincular prestador de serviço"
      id="supplier"
      zIndex={20}
    >
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Container>
          <p className="p2">
            Clique em uma das opções abaixo para vincular o prestador de serviço desejado:
          </p>

          <Style.Content>
            <Style.Section>
              <h6>Sugeridos</h6>
              {suggestedSuppliers.length > 0 ? (
                <Style.ScrollDiv>
                  {suggestedSuppliers.map(({ id, name, categories, isSelected }) => (
                    <Style.Card
                      disabled={onQuery}
                      selected={!!isSelected}
                      key={id}
                      onClick={() => {
                        linkToMaintenanceHistory(id);
                      }}
                    >
                      <p className="p4">{name}</p>
                      <p className="p5">
                        {categories.map(({ category }) => category.name).join(', ')}
                      </p>
                    </Style.Card>
                  ))}
                </Style.ScrollDiv>
              ) : (
                <p className="p4 opacity">Nenhum prestador de serviço encontrado.</p>
              )}
            </Style.Section>

            <Style.Section>
              <h6>Outros</h6>
              {remainingSuppliers.length > 0 ? (
                <Style.ScrollDiv>
                  {remainingSuppliers.map(({ id, name, categories, isSelected }) => (
                    <Style.Card
                      disabled={onQuery}
                      selected={!!isSelected}
                      key={id}
                      onClick={() => {
                        linkToMaintenanceHistory(id);
                      }}
                    >
                      <p className="p4">{name}</p>
                      <p className="p5">
                        {categories.map(({ category }) => category.name).join(', ')}
                      </p>
                    </Style.Card>
                  ))}
                </Style.ScrollDiv>
              ) : (
                <p className="p4 opacity">Nenhum prestador de serviço encontrado.</p>
              )}
            </Style.Section>
          </Style.Content>

          <p className="p3">
            Não encontrou o prestador de serviço que procura?{' '}
            <span
              role="button"
              tabIndex={0}
              onClick={() => {
                setModalCreateAndLinkSupplierOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setModalCreateAndLinkSupplierOpen(true);
                }
              }}
            >
              Clique aqui para cadastrar!
            </span>
          </p>
        </Style.Container>
      )}
    </CustomModal>
  );
};
