// REACT
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ReturnButton } from '@components/Buttons/ReturnButton';
import { IconButton } from '@components/Buttons/IconButton';

// GLOBAL ASSETS
import { icon } from '@assets/icons/index';
import IconSearch from '@assets/icons/IconSearch';
import IconCsvLogo from '@assets/icons/IconCsvLogo';
import IconPdfLogo from '@assets/icons/IconPdfLogo';
import IconEdit from '@assets/icons/IconEdit';

// GLOBAL TYPES
import type { IUser } from '@customTypes/IUser';

// COMPONENTS
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';
import { ModalPrintPlan } from './utils/ModalPrintPlan';

// FUNCTIONS
import {
  filterFunction,
  handleGetUsersResponsible,
  requestAddedMaintenances,
} from './utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { AddedMaintenances } from './utils/types';

export const BuildingMaintenancesList = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();

  const { search } = window.location;

  const [addedMaintenances, setAddedMaintenances] = useState<AddedMaintenances[]>([]);
  const [usersResponsible, setUsersResponsible] = useState<{ User: IUser }[]>([]);
  const [buildingName, setBuildingName] = useState<string>('');

  const [filter, setFilter] = useState<string>('');
  const [addedMaintenancesForFilter, setAddedMaintenancesForFilter] = useState<AddedMaintenances[]>(
    [],
  );

  const [modalPrintPlanOpen, setModalPrintPlanOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const csvHeaders = [
    { label: 'Edificação', key: 'Edificação' },
    { label: 'Categoria', key: 'Categoria' },
    { label: 'Elemento', key: 'Elemento' },
    { label: 'Atividade', key: 'Atividade' },
    { label: 'Periodicidade', key: 'Periodicidade' },
    { label: 'Fonte', key: 'Fonte' },
    { label: 'Prazo para execução', key: 'Prazo para execução' },
    { label: 'Antecedência', key: 'Antecedência' },
    { label: 'Última execução', key: 'Última execução' },
    { label: 'Próxima notificação', key: 'Próxima notificação' },
  ];

  const csvData = addedMaintenances.flatMap(({ Building, Category, Maintenances }) =>
    Maintenances.map(({ Maintenance, daysToAnticipate }) => ({
      Edificação: Building.name,
      Categoria: Category.name,
      Elemento: Maintenance.element,
      Atividade: Maintenance.activity,
      Periodicidade: `A cada ${Maintenance.frequency} ${
        Maintenance.frequency > 1
          ? Maintenance.FrequencyTimeInterval.pluralLabel
          : Maintenance.FrequencyTimeInterval.singularLabel
      }`,
      Fonte: Maintenance.source,
      'Prazo para execução': `${Maintenance.period} ${
        Maintenance.period > 1
          ? Maintenance.PeriodTimeInterval.pluralLabel
          : Maintenance.PeriodTimeInterval.singularLabel
      }`,
      Antecedência: daysToAnticipate
        ? `${daysToAnticipate} ${!!daysToAnticipate && daysToAnticipate > 1 ? 'dias' : 'dia'}`
        : '',
      'Última execução': Maintenance.lastResolutionDate,
      'Próxima notificação': Maintenance.nextNotificationDate,
    })),
  );

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    async function fetchData() {
      if (!buildingId) return;

      const responseData = await handleGetUsersResponsible({ buildingId });

      setUsersResponsible(responseData);
    }

    fetchData().then(() =>
      requestAddedMaintenances({
        setLoading,
        setAddedMaintenances,
        buildingId: buildingId!,
        setBuildingName,
        setAddedMaintenancesForFilter,
      }),
    );
  }, [buildingId, refresh]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalPrintPlanOpen && (
        <ModalPrintPlan setModal={setModalPrintPlanOpen} categories={addedMaintenances} />
      )}
      <Style.Header>
        <Style.HeaderWrapper>
          <Style.LeftSide>
            <Style.HeaderTitle>
              <h2>{buildingName} / Plano de manutenção</h2>
            </Style.HeaderTitle>
          </Style.LeftSide>

          <Style.RightSide>
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={`Plano de manutenção ${new Date().toLocaleDateString('pt-BR')}`}
              onClick={() => addedMaintenances.length !== 0}
            >
              <IconButton
                label="Exportar"
                icon={<IconCsvLogo strokeColor="primary" fillColor="" />}
                disabled={addedMaintenances.length < 1}
                hideLabelOnMedia
                onClick={() => {
                  //
                }}
              />
            </CSVLink>

            <IconButton
              label="Exportar"
              icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
              disabled={addedMaintenances.length < 1}
              hideLabelOnMedia
              onClick={() => {
                setModalPrintPlanOpen(true);
              }}
            />

            <IconButton
              label="Editar"
              icon={<IconEdit strokeColor="primary" />}
              hideLabelOnMedia
              onClick={() =>
                navigate(`/buildings/details/${buildingId}/maintenances/manage${search}`)
              }
            />
          </Style.RightSide>
        </Style.HeaderWrapper>

        <Style.SearchField>
          <IconButton
            icon={<IconSearch strokeColor="primary" />}
            fill="primary"
            size="16px"
            onClick={() => {
              filterFunction({ addedMaintenancesForFilter, setAddedMaintenances, filter });
            }}
          />
          <input
            type="text"
            placeholder="Procurar"
            value={filter}
            onChange={(evt) => {
              setFilter(evt.target.value);
              if (evt.target.value === '') {
                filterFunction({ addedMaintenancesForFilter, setAddedMaintenances, filter: '' });
              }
            }}
            onKeyUp={(evt) => {
              if (evt.key === 'Enter') {
                filterFunction({ addedMaintenancesForFilter, setAddedMaintenances, filter });
              }
            }}
          />
        </Style.SearchField>

        <ReturnButton path={`/buildings/details/${buildingId}${search}`} />
      </Style.Header>

      {addedMaintenances?.length ? (
        <Style.CategoriesContainer>
          {addedMaintenances.map((element) => (
            <MaintenanceCategory
              key={element.Category.id}
              data={element}
              usersResponsible={usersResponsible}
              handleRefresh={handleRefresh}
            />
          ))}
        </Style.CategoriesContainer>
      ) : (
        <Style.NoMaintenancesContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhuma categoria ou manutenção encontrada.</h3>
        </Style.NoMaintenancesContainer>
      )}
    </>
  );
};
