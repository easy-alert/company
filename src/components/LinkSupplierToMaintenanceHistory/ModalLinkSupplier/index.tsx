/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { CustomModal } from '../CustomModal';
import * as Style from './styles';
import { DotSpinLoading } from '../../Loadings/DotSpinLoading';
import { LoadingWrapper } from '../../Loadings/LoadingWrapper';

interface ISupplier {
  id: string;
  name: string;
  serviceTypes: {
    type: { label: string };
  }[];
  isSelected: boolean;
}

interface IModalLinkSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceHistoryId: string;
  findMaintenanceHistorySupplier: () => Promise<void>;
  setModalCreateAndLinkSupplierOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalLinkSupplier = ({
  setModal,
  maintenanceHistoryId,
  findMaintenanceHistorySupplier,
  setModalCreateAndLinkSupplierOpen,
}: IModalLinkSupplier) => {
  const [suggestedSuppliers, setSuggestedSuppliers] = useState<ISupplier[]>([]);
  const [remainingSuppliers, setRemainingSuppliers] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [onQuery, setOnQuery] = useState(false);

  // tirar o delete many no linkWithMaintenanceHistory se for vincular a mais de 1 fornecedor
  const findCompanySuppliers = async () => {
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
    <CustomModal setModal={setModal} title="Vincular fornecedor" id="supplier">
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Container>
          <p className="p2">Clique em uma das opções abaixo para vincular o fornecedor desejado:</p>

          <Style.Content>
            <Style.Section>
              <h6>Sugeridos</h6>
              {suggestedSuppliers.length > 0 ? (
                suggestedSuppliers.map(({ id, name, serviceTypes, isSelected }) => (
                  <Style.Card
                    disabled={onQuery}
                    selected={isSelected}
                    key={id}
                    onClick={() => {
                      linkToMaintenanceHistory(id);
                    }}
                  >
                    <p className="p4">{name}</p>
                    <p className="p5">{serviceTypes.map(({ type }) => type.label).join(', ')}</p>
                  </Style.Card>
                ))
              ) : (
                <p className="p4 opacity">Nenhum fornecedor encontrado.</p>
              )}
            </Style.Section>

            <Style.Section>
              <h6>Outros</h6>
              {remainingSuppliers.length > 0 ? (
                remainingSuppliers.map(({ id, name, serviceTypes, isSelected }) => (
                  <Style.Card
                    disabled={onQuery}
                    selected={isSelected}
                    key={id}
                    onClick={() => {
                      linkToMaintenanceHistory(id);
                    }}
                  >
                    <p className="p4">{name}</p>
                    <p className="p5">{serviceTypes.map(({ type }) => type.label).join(', ')}</p>
                  </Style.Card>
                ))
              ) : (
                <p className="p4 opacity">Nenhum fornecedor encontrado.</p>
              )}
            </Style.Section>
          </Style.Content>

          <p className="p3">
            Não encontrou o fornecedor que procura?{' '}
            <span
              role="button"
              onClick={() => {
                setModalCreateAndLinkSupplierOpen(true);
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
