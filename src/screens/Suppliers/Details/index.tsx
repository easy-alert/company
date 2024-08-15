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
import { SortHeader } from '../../Maintenances/List/utils/components/MaintenanceCategory/styles';
import { ImageComponent } from '../../../components/ImageComponent';

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

  areaOfActivities: {
    areaOfActivity: { label: string };
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
    areaOfActivities: [],
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

  type MaintenanceKey = 'id' | 'activity' | 'element' | 'Category.name';

  const [sortConfig, setSortConfig] = useState<{ key: MaintenanceKey; ascending: boolean }>({
    key: 'Category.name',
    ascending: true,
  });

  const sortMaintenances = (key: MaintenanceKey) => {
    const ascending = sortConfig.key === key ? !sortConfig.ascending : true;

    const sortedMaintenances = [...supplier.maintenances].sort((a, b) => {
      let aValue;
      let bValue;

      switch (key) {
        case 'id':
          aValue = a.maintenance.id;
          bValue = b.maintenance.id;
          break;
        case 'activity':
          aValue = a.maintenance.activity;
          bValue = b.maintenance.activity;
          break;
        case 'element':
          aValue = a.maintenance.element;
          bValue = b.maintenance.element;
          break;
        case 'Category.name':
          aValue = a.maintenance.Category.name;
          bValue = b.maintenance.Category.name;
          break;
        default:
          return 0;
      }

      return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      maintenances: sortedMaintenances,
    }));

    setSortConfig({ key, ascending });
  };

  const checkConfigKey = (key: MaintenanceKey) => sortConfig.key === key;

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
              <p className="p2">
                {supplier.areaOfActivities
                  .map(({ areaOfActivity }) => areaOfActivity.label)
                  .join(', ')}
              </p>
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
              {supplier.maintenances.length > 0 ? (
                <>
                  <Style.MaintenaceHeader>
                    <SortHeader
                      highlighted={checkConfigKey('Category.name')}
                      onClick={() => {
                        sortMaintenances('Category.name');
                      }}
                    >
                      <p className="p2">Categoria</p>
                      <ImageComponent
                        src={
                          checkConfigKey('Category.name') && sortConfig.ascending
                            ? icon.downTriangle
                            : icon.upTriangle
                        }
                        size="8px"
                      />
                    </SortHeader>
                    <SortHeader
                      highlighted={checkConfigKey('element')}
                      onClick={() => {
                        sortMaintenances('element');
                      }}
                    >
                      <p className="p2">Elemento</p>
                      <ImageComponent
                        src={
                          checkConfigKey('element') && sortConfig.ascending
                            ? icon.downTriangle
                            : icon.upTriangle
                        }
                        size="8px"
                      />
                    </SortHeader>
                    <SortHeader
                      highlighted={checkConfigKey('activity')}
                      onClick={() => {
                        sortMaintenances('activity');
                      }}
                    >
                      <p className="p2">Atividade</p>
                      <ImageComponent
                        src={
                          checkConfigKey('activity') && sortConfig.ascending
                            ? icon.downTriangle
                            : icon.upTriangle
                        }
                        size="8px"
                      />
                    </SortHeader>
                  </Style.MaintenaceHeader>
                  <>
                    {supplier.maintenances.map(
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
                              title: 'Deseja remover a sugestão deste fornecedor na manutenção?',
                              content: 'Esta ação é reversível.',
                            }}
                            buttonIconSize="18px"
                            buttonIcon={icon.unlink2}
                          />
                        </Style.MaintenanceCard>
                      ),
                    )}
                  </>
                </>
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
