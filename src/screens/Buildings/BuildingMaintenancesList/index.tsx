/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import { useNavigate, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import * as Style from './styles';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { AddedMaintenances } from './utils/types';

// FUNCTIONS
import { filterFunction, requestAddedMaintenances } from './utils/functions';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { IconButton } from '../../../components/Buttons/IconButton';
import { ModalPrintPlan } from './utils/ModalPrintPlan';

export const BuildingMaintenancesList = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();

  const [modalPrintPlanOpen, setModalPrintPlanOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedMaintenances, setAddedMaintenances] = useState<AddedMaintenances[]>([]);

  const [addedMaintenancesForFilter, setAddedMaintenancesForFilter] = useState<AddedMaintenances[]>(
    [],
  );

  const [buildingName, setBuildingName] = useState<string>('');

  const [filter, setFilter] = useState<string>('');

  const { search } = window.location;

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

  useEffect(() => {
    requestAddedMaintenances({
      setLoading,
      setAddedMaintenances,
      buildingId: buildingId!,
      setBuildingName,
      setAddedMaintenancesForFilter,
    });
  }, []);

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
                disabled={addedMaintenances.length < 1}
                icon={icon.csvLogo2}
                label="Exportar"
                hideLabelOnMedia
                onClick={() => {
                  //
                }}
              />
            </CSVLink>

            <IconButton
              disabled={addedMaintenances.length < 1}
              icon={icon.pdfLogo2}
              label="Exportar"
              hideLabelOnMedia
              onClick={() => {
                setModalPrintPlanOpen(true);
              }}
            />

            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                navigate(`/buildings/details/${buildingId}/maintenances/manage${search}`);
              }}
            />
          </Style.RightSide>
        </Style.HeaderWrapper>
        <Style.SearchField>
          <IconButton
            icon={icon.search}
            size="16px"
            onClick={() => {
              filterFunction({ addedMaintenancesForFilter, setAddedMaintenances, filter });
            }}
          />
          <input
            type="text"
            maxLength={80}
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
            <MaintenanceCategory key={element.Category.id} data={element} />
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
