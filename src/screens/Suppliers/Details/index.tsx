/* eslint-disable import/no-cycle */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { applyMask, catchHandler } from '../../../utils/functions';
import * as Style from './styles';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { theme } from '../../../styles/theme';
import { Image } from '../../../components/Image';
import { ModalEditSupplier } from './ModalEditSupplier';
import { NoDataFound } from '../../../components/NoDataFound';

export interface ISupplier {
  id: string;
  image: string;
  name: string;
  state: string;
  city: string;
  cnpj: string | null;

  phone: string | null;
  email: string | null;
  link: string | null;

  serviceTypes: {
    type: { label: string };
  }[];

  maintenances: {
    maintenance: {
      id: string;
      activity: string;
      element: string;
      Category: { name: string };
    };
  }[];
}

export const SupplierDetails = () => {
  const { supplierId } = useParams() as { supplierId: string };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [modalEditSupplierOpen, setModalEditSupplierOpen] = useState(false);

  const [supplier, setSupplier] = useState<ISupplier>({
    email: '',
    id: '',
    image: '',
    link: '',
    name: '',
    phone: '',
    cnpj: '',
    city: '',
    serviceTypes: [],
    state: '',
    maintenances: [],
  });

  const deleteSupplier = async () => {
    setOnQuery(true);

    await Api.delete(`/suppliers/${supplierId}`)
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
        navigate(`/suppliers${window.location.search}`);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const findSupplierById = async () => {
    await Api.get(`/suppliers/${supplierId}`)
      .then((res) => {
        setSupplier(res.data.supplier);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const unlinkToMaintenance = async (maintenanceId: string) => {
    setOnQuery(true);

    await Api.post(`/suppliers/unlink-to-maintenance`, {
      maintenanceId,
      supplierId,
    })
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
        findSupplierById();
      });
  };

  useEffect(() => {
    findSupplierById();
  }, []);

  return (
    <>
      {loading && <DotSpinLoading />}

      {!loading && (
        <>
          {modalEditSupplierOpen && (
            <ModalEditSupplier
              setModal={setModalEditSupplierOpen}
              onThenRequest={findSupplierById}
              supplier={supplier}
            />
          )}

          <Style.Header>
            <h2>Detalhes de fornecedor</h2>
          </Style.Header>

          <ReturnButton path={`/suppliers${window.location.search}`} />
          <Style.CardSection>
            <Style.Card>
              <h6>Imagem/Logo</h6>
              <Image img={supplier?.image} size="80px" />
            </Style.Card>

            <Style.Card>
              <h6>Nome</h6>
              <p className="p2">{supplier.name}</p>
            </Style.Card>

            <Style.Card>
              <h6>CNPJ</h6>
              <p className="p2">
                {supplier.cnpj ? applyMask({ mask: 'CNPJ', value: supplier.cnpj }).value : '-'}
              </p>
            </Style.Card>

            <Style.Card>
              <h6>E-mail</h6>
              <p className="p2">{supplier.email || '-'}</p>
            </Style.Card>

            <Style.Card>
              <h6>Telefone/Celular</h6>
              <p className="p2">
                {supplier.phone ? applyMask({ mask: 'TEL', value: supplier.phone }).value : '-'}
              </p>
            </Style.Card>

            <Style.Card>
              <h6>Área de atuação</h6>
              <p className="p2">{supplier.serviceTypes.map(({ type }) => type.label).join(', ')}</p>
            </Style.Card>

            <Style.Card>
              <h6>Estado</h6>
              <p className="p2">{supplier.state || '-'}</p>
            </Style.Card>

            <Style.Card>
              <h6>Cidade</h6>
              <p className="p2">{supplier.city || '-'}</p>
            </Style.Card>

            <Style.Card>
              <h6>Link</h6>
              {supplier.link ? (
                <a target="_blank" rel="noreferrer" className="p2" href={supplier.link}>
                  {supplier.link}
                </a>
              ) : (
                '-'
              )}
            </Style.Card>
          </Style.CardSection>

          <Style.Footer>
            <PopoverButton
              disabled={onQuery}
              actionButtonBgColor={theme.color.actionDanger}
              type="IconButton"
              hideLabelOnMedia
              label="Excluir"
              buttonIcon={icon.trashWithBg}
              message={{
                title: 'Deseja excluir este fornecedor?',
                content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                contentColor: theme.color.danger,
              }}
              actionButtonClick={deleteSupplier}
            />

            <IconButton
              disabled={onQuery}
              hideLabelOnMedia
              icon={icon.editWithBg}
              label="Editar"
              onClick={() => {
                setModalEditSupplierOpen(true);
              }}
            />
          </Style.Footer>

          <h2>Manutenções vinculadas</h2>
          <div style={{ overflowX: 'auto' }}>
            <Style.MaintenancesContainer>
              <Style.MaintenaceHeader>
                <p className="p2">Categoria</p>
                <p className="p2">Elemento</p>
                <p className="p2">Atividade</p>
              </Style.MaintenaceHeader>
              {supplier.maintenances.length > 0 ? (
                supplier.maintenances.map(
                  ({ maintenance: { Category, activity, element, id } }) => (
                    <Style.MaintenanceCard key={id}>
                      <p className="p2">{Category.name}</p>
                      <p className="p2">{element}</p>
                      <p className="p2">{activity}</p>
                      <PopoverButton
                        label="Desvincular"
                        hiddenIconButtonLabel
                        type="IconButton"
                        actionButtonClick={() => {
                          unlinkToMaintenance(id);
                        }}
                        message={{
                          title: 'Deseja desvincular essa manutenção?',
                          content: 'Esta ação é reversível.',
                        }}
                        buttonIconSize="18px"
                        buttonIcon={icon.unlink2}
                      />
                    </Style.MaintenanceCard>
                  ),
                )
              ) : (
                <NoDataFound label="Nenhuma manutenção vinculada." height="200px" />
              )}
            </Style.MaintenancesContainer>
          </div>
        </>
      )}
    </>
  );
};
