// REACT
import { useEffect, useRef, useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';
import { useUsersForSelect } from '@hooks/useUsersForSelect';
import { useQuery } from '@hooks/useQuery';

// SERVICES
import { getMaintenancesKanban } from '@services/apis/getMaintenancesKanban';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { IconButton } from '@components/Buttons/IconButton';
import { ListTag } from '@components/ListTag';
import { useMaintenanceStatusForSelect } from '@hooks/useMaintenanceStatusForSelect';
import { EventTag } from '@components/EventTag';
import { FutureMaintenanceTag } from '@components/FutureMaintenanceTag';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikInput } from '@components/Form/FormikInput';
import { Skeleton } from '@components/Skeleton';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalCreateOccasionalMaintenance } from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance';

// GLOBAL UTILS
import { capitalizeFirstLetter, dateFormatter } from '@utils/functions';
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import IconList from '@assets/icons/IconList';
import IconBlock from '@assets/icons/IconBlock';
import IconFilter from '@assets/icons/IconFilter';

// GLOBAL TYPES
import { MAINTENANCE_TYPE } from '@customTypes/TMaintenanceType';
import { PRIORITY_NAME } from '@customTypes/TPriorityName';
import type { TModalNames } from '@customTypes/TModalNames';

// STYLES
import * as Style from './styles';

// TYPES
import type { IKanban } from './types';

export interface IMaintenanceFilter {
  buildings: string[];
  status: string[];
  categories: string[];
  users: string[];
  priorityNames: string[];
  types: string[];
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface IMaintenanceCategoryForSelect {
  id: string;
  name: string;
}

export const MaintenancesKanban = () => {
  const { account } = useAuthContext();

  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });
  const { usersForSelect } = useUsersForSelect({ buildingId: '' });
  const { maintenanceStatusForSelect } = useMaintenanceStatusForSelect();

  const didMount = useRef(false);

  const query = useQuery();
  const queryBuildingId = query.get('buildingId');
  const queryCategoryId = query.get('categoryId');

  const [kanban, setKanban] = useState<IKanban[]>([]);

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');

  const [modalAdditionalInformations, setModalAdditionalInformations] = useState({
    id: '',
    expectedNotificationDate: '',
    expectedDueDate: '',
    isFuture: false,
  });

  const [maintenancesLength, setMaintenancesLength] = useState<{ [key: string]: number }>({
    pending: 0,
    inProgress: 0,
    completed: 0,
    expired: 0,
    oldExpired: 0,
    future: 0,
  });

  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
    useState<boolean>(false);

  const [showFutureMaintenances, setShowFutureMaintenances] = useState<boolean>(false);
  const [showOldExpireds, setShowOldExpireds] = useState<boolean>(false);

  const [maintenanceCategoriesForSelect, setMaintenanceCategoriesForSelect] = useState<
    IMaintenanceCategoryForSelect[]
  >([]);
  const [filter, setFilter] = useState<IMaintenanceFilter>({
    buildings: queryBuildingId ? [queryBuildingId] : [],
    status: [],
    categories: queryCategoryId ? [queryCategoryId] : [],
    users: [],
    priorityNames: [],
    types: [],
    search: '',
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  });
  const [showFilter, setShowFilter] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);

  const showPriority = account?.Company.showMaintenancePriority;

  const handleModals = (modal: TModalNames, modalState: boolean) => {
    switch (modal) {
      case 'modalMaintenanceReportSend':
        setModalMaintenanceReportSend(modalState);
        break;
      case 'modalMaintenanceDetails':
        setModalMaintenanceDetails(modalState);
        break;
      case 'modalCreateOccasionalMaintenance':
        setModalCreateOccasionalMaintenance(modalState);
        break;

      default:
        break;
    }
  };

  const toggleColumn = (title: string) => {
    setExpandedColumns((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleQuery = (queryState: boolean) => {
    setOnQuery(queryState);
  };

  const handleMaintenanceHistoryIdChange = (id: string) => {
    setMaintenanceHistoryId(id);
  };

  const handleMaintenancesLength = (kanbanToLength: IKanban[]) => {
    const pendingLength =
      kanbanToLength.find((k) => k.status === 'Pendentes')?.maintenances.length || 0;
    const completedLength =
      kanbanToLength.find((k) => k.status === 'Concluídas')?.maintenances.length || 0;
    const inProgressLength =
      kanbanToLength.find((k) => k.status === 'Em execução')?.maintenances.length || 0;
    const expiredLength =
      kanbanToLength.find((k) => k.status === 'Vencidas')?.maintenances.length || 0;
    const futureLength =
      kanbanToLength
        .find((k) => k.status === 'Pendentes')
        ?.maintenances.filter((m) => new Date(m.date) > new Date(new Date().setHours(0, 0, 0, 0)))
        .length || 0;

    setMaintenancesLength({
      pending: pendingLength - futureLength,
      completed: completedLength,
      inProgress: inProgressLength,
      expired: expiredLength,
      future: futureLength,
    });
  };

  // region filter functions
  const handleFilterChange = (key: keyof IMaintenanceFilter, value: string) => {
    setFilter((prevState) => {
      const checkArray = Array.isArray(prevState[key]);
      const newFilter = { ...prevState, [key]: value };

      if (checkArray) {
        return {
          ...newFilter,
          [key]: [...(prevState[key] as string[]), value],
        };
      }

      return newFilter;
    });
  };

  const handleClearFilter = () => {
    setFilter({
      buildings: [],
      status: [],
      categories: [],
      users: [],
      priorityNames: [],
      types: [],
      search: '',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    });
  };
  // endregion

  // region api functions
  const handleGetMaintenances = async () => {
    setLoading(true);

    try {
      const responseData = await getMaintenancesKanban({
        userId: account?.User.id ?? '',
        filter,
      });

      setKanban(responseData.kanban);
      setMaintenanceCategoriesForSelect(responseData.maintenanceCategoriesForSelect);
      handleMaintenancesLength(responseData.kanban);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  // # endregion

  useEffect(() => {
    if (didMount.current) {
      handleGetMaintenances();
    } else {
      didMount.current = true;
    }
  }, [refresh]);

  return (
    <>
      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          buildingsForSelect={buildingsForSelect}
          handleModalCreateOccasionalMaintenance={setModalCreateOccasionalMaintenance}
          handleMaintenanceHistoryIdChange={handleMaintenanceHistoryIdChange}
          handleModalMaintenanceDetails={setModalMaintenanceDetails}
          handleModalSendMaintenanceReport={setModalMaintenanceReportSend}
          handleGetBackgroundData={handleGetMaintenances}
        />
      )}

      {modalMaintenanceReportSend && (
        <ModalMaintenanceReportSend
          maintenanceHistoryId={maintenanceHistoryId}
          refresh={refresh}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {modalMaintenanceDetails && (
        <ModalMaintenanceDetails
          modalAdditionalInformations={{
            ...modalAdditionalInformations,
            id: maintenanceHistoryId || modalAdditionalInformations.id,
          }}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
          handleQuery={handleQuery}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <h2>Manutenções</h2>

            <IconButton
              labelPos="right"
              label="Filtros"
              icon={<IconFilter strokeColor="primary" fillColor="" />}
              hideLabelOnMedia
              disabled={loading}
              onClick={() => setShowFilter((prevState) => !prevState)}
            />

            <IconButton
              labelPos="right"
              label={viewMode === 'kanban' ? 'Visualizar em lista' : 'Visualizar em blocos'}
              icon={
                viewMode === 'kanban' ? (
                  <IconList strokeColor="white" fillColor="primary" />
                ) : (
                  <IconBlock
                    strokeColor="white"
                    backgroundColor="primary"
                    padding="0"
                    size="14px"
                  />
                )
              }
              onClick={() => setViewMode((prev) => (prev === 'kanban' ? 'list' : 'kanban'))}
              disabled={loading}
            />
          </Style.HeaderWrapper>

          <Style.IconsContainer>
            <IconButton
              label="Manutenção avulsa"
              icon={<IconPlus strokeColor="primary" />}
              permToCheck="maintenances:createOccasional"
              disabled={loading}
              onClick={() => handleModals('modalCreateOccasionalMaintenance', true)}
            />
          </Style.IconsContainer>
        </Style.Header>

        {showFilter && (
          <Style.FiltersContainer>
            <Formik
              initialValues={filter}
              onSubmit={async () => {
                setShowFutureMaintenances(false);
                setShowOldExpireds(false);
                handleGetMaintenances();
              }}
            >
              {() => (
                <Form>
                  <Style.FilterWrapper>
                    <FormikSelect
                      id="building-select"
                      label="Edificação"
                      selectPlaceholderValue={' '}
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('buildings', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            buildings: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.buildings.length === 0}>
                        Todas
                      </option>

                      {buildingsForSelect?.map((building) => (
                        <option
                          value={building.id}
                          key={building.id}
                          disabled={filter.buildings.some((b) => b === building.id)}
                        >
                          {building.name}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="users-select"
                      label="Usuário"
                      selectPlaceholderValue=" "
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('users', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            users: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.users.length === 0}>
                        Todos
                      </option>

                      {usersForSelect?.map((user) => (
                        <option
                          value={user.id}
                          key={user.id}
                          disabled={filter.users.some((u) => u === user.id)}
                        >
                          {user.name}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="status-select"
                      label="Status"
                      selectPlaceholderValue={' '}
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('status', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            status: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.status.length === 0}>
                        Todas
                      </option>

                      {maintenanceStatusForSelect?.map((maintenanceStatus) => (
                        <option
                          key={maintenanceStatus.id}
                          value={maintenanceStatus.name}
                          disabled={filter.status.some((s) => s === maintenanceStatus.id)}
                        >
                          {capitalizeFirstLetter(maintenanceStatus.singularLabel ?? '')}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="category-select"
                      label="Categoria"
                      selectPlaceholderValue={' '}
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('categories', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            status: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.categories.length === 0}>
                        Todas
                      </option>

                      {maintenanceCategoriesForSelect?.map((maintenanceCategory) => (
                        <option
                          key={maintenanceCategory.id}
                          value={maintenanceCategory.id}
                          disabled={filter.categories.some((c) => c === maintenanceCategory.id)}
                        >
                          {maintenanceCategory.name}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="priority-select"
                      name="priorityName"
                      label="Prioridade"
                      disabled={loading || !showPriority}
                      selectPlaceholderValue={' '}
                      value=""
                      onChange={(e) => {
                        handleFilterChange('priorityNames', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            priorityNames: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.priorityNames?.length === 0}>
                        Todas
                      </option>

                      {PRIORITY_NAME.map((priority) => (
                        <option
                          key={priority.name}
                          value={priority.name}
                          disabled={filter.priorityNames?.includes(priority.name)}
                        >
                          {capitalizeFirstLetter(priority.label)}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="maintenance-type-select"
                      label="Tipo de manutenção"
                      selectPlaceholderValue={' '}
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('types', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            types: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.types?.length === 0}>
                        Todas
                      </option>

                      {MAINTENANCE_TYPE.map((maintenanceType) => (
                        <option
                          key={maintenanceType.value}
                          value={maintenanceType.value}
                          disabled={filter.types?.includes(maintenanceType.value)}
                        >
                          {capitalizeFirstLetter(maintenanceType.label)}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikInput
                      name="search"
                      label="Buscar"
                      placeholder="Procurar por algum termo"
                      value={filter.search}
                      disabled={loading}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />

                    <FormikInput
                      label="Data inicial"
                      typeDatePlaceholderValue={filter.startDate}
                      name="startDate"
                      type="date"
                      value={filter.startDate}
                      disabled={loading}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />

                    <FormikInput
                      label="Data final"
                      typeDatePlaceholderValue={filter.endDate}
                      name="endDate"
                      type="date"
                      value={filter.endDate}
                      disabled={loading}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </Style.FilterWrapper>

                  <Style.FilterWrapperFooter>
                    <Style.FilterTags>
                      {filter.buildings?.length === 0 ? (
                        <ListTag
                          label="Todas as edificações"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.buildings?.map((building) => (
                          <ListTag
                            key={building}
                            label={buildingsForSelect.find((b) => b.id === building)?.name || ''}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                buildings: prevState.buildings?.filter((b) => b !== building),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.users?.length === 0 ? (
                        <ListTag
                          label="Todos os usuários"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.users?.map((user) => (
                          <ListTag
                            key={user}
                            label={usersForSelect.find((u) => u.id === user)?.name || ''}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                users: prevState.users?.filter((u) => u !== user),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.status?.length === 0 ? (
                        <ListTag
                          label="Todos os status"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.status?.map((status) => (
                          <ListTag
                            key={status}
                            label={capitalizeFirstLetter(
                              maintenanceStatusForSelect.find((ms) => ms.name === status)
                                ?.singularLabel || '',
                            )}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                status: prevState.status?.filter((s) => s !== status),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.categories?.length === 0 ? (
                        <ListTag
                          label="Todos as categorias"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.categories?.map((category) => (
                          <ListTag
                            key={category}
                            label={
                              maintenanceCategoriesForSelect.find((mc) => mc.id === category)
                                ?.name || ''
                            }
                            color="white"
                            backgroundColor="primaryM"
                            padding="4px 12px"
                            fontWeight={500}
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                status: prevState.categories?.filter((c) => c !== category),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.types?.length === 0 ? (
                        <ListTag
                          label="Todos os tipos"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.types?.map((type) => (
                          <ListTag
                            key={type}
                            label={capitalizeFirstLetter(
                              MAINTENANCE_TYPE.find((mt) => mt.value === type)?.label || '',
                            )}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                type: prevState.types?.filter((t) => t !== type),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.priorityNames?.length === 0 ? (
                        <ListTag
                          label="Todas as prioridades"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.priorityNames?.map((priority) => (
                          <ListTag
                            key={priority}
                            label={capitalizeFirstLetter(
                              PRIORITY_NAME.find((p) => p.name === priority)?.label || '',
                            )}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                priorityNames: prevState.priorityNames?.filter(
                                  (p) => p !== priority,
                                ),
                              }));
                            }}
                          />
                        ))
                      )}
                    </Style.FilterTags>

                    <Style.FilterButtonWrapper>
                      <Button
                        type="button"
                        label="Limpar filtros"
                        borderless
                        textColor="primary"
                        disable={loading}
                        onClick={() => handleClearFilter()}
                      />

                      <Button type="submit" label="Filtrar" disable={loading} bgColor="primary" />
                    </Style.FilterButtonWrapper>
                  </Style.FilterWrapperFooter>
                </Form>
              )}
            </Formik>
          </Style.FiltersContainer>
        )}

        {viewMode === 'kanban' ? (
          <Style.Kanban>
            {loading
              ? [
                  { label: 'Vencidas/Expiradas', name: 'expired' },
                  { label: 'Pendentes', name: 'pending' },
                  { label: 'Em execução', name: 'inProgress' },
                  { label: 'Concluídas', name: 'completed' },
                ].map((col) => (
                  <Style.KanbanCard key={`skeleton-kanban-${col.name}`}>
                    <Style.KanbanHeader viewMode={viewMode}>
                      <h2>{col.label} (0)</h2>
                    </Style.KanbanHeader>
                    {[1, 2, 3, 4].map((skeletonId) => (
                      <Style.SkeletonInfo key={skeletonId}>
                        <Skeleton key={skeletonId} height="120px" />
                      </Style.SkeletonInfo>
                    ))}
                  </Style.KanbanCard>
                ))
              : kanban?.map((card) => (
                  <Style.KanbanCard key={card.status}>
                    <Style.KanbanHeader viewMode={viewMode}>
                      <h2>
                        {card.status === 'Vencidas' ? 'Vencidas/Expiradas' : card.status} (
                        {maintenancesLength[handleTranslate({ key: card.status, plural: true })]})
                      </h2>

                      {card.status === 'Vencidas' && (
                        <label htmlFor="showExpireds">
                          <input
                            type="checkbox"
                            id="showExpireds"
                            checked={showOldExpireds}
                            onChange={() => setShowOldExpireds((prevState) => !prevState)}
                          />
                          Mostrar expiradas
                        </label>
                      )}
                      {card.status === 'Pendentes' && (
                        <label htmlFor="showFuture">
                          <input
                            type="checkbox"
                            id="showFuture"
                            checked={showFutureMaintenances}
                            onChange={() => {
                              if (showFutureMaintenances) {
                                setShowFutureMaintenances(false);
                                setMaintenancesLength((prevState) => ({
                                  ...prevState,
                                  pending: prevState.pending - prevState.future,
                                }));
                              } else {
                                setShowFutureMaintenances(true);
                                setMaintenancesLength((prevState) => ({
                                  ...prevState,
                                  pending: prevState.pending + prevState.future,
                                }));
                              }
                            }}
                          />
                          Mostrar futuras
                        </label>
                      )}
                    </Style.KanbanHeader>

                    {!loading &&
                      card?.maintenances?.length > 0 &&
                      card?.maintenances?.map((maintenance) => {
                        const isPending = maintenance.status === 'pending';
                        const isFuture =
                          new Date(maintenance.date) > new Date(new Date().setHours(0, 0, 0, 0));
                        const showExpiredOccasional =
                          maintenance.type === 'occasional' && maintenance.status === 'expired';
                        const isExpired = maintenance.status === 'expired';
                        const isOldExpired =
                          maintenance.status === 'expired' && maintenance.cantReportExpired;
                        const { inProgress } = maintenance;

                        const shouldRender =
                          (((showFutureMaintenances && isPending && isFuture) ||
                            (isPending && !isFuture) ||
                            !isPending) &&
                            ((showOldExpireds && isExpired && isOldExpired) ||
                              (isExpired && !isOldExpired) ||
                              !isExpired)) ||
                          showExpiredOccasional ||
                          inProgress;

                        return shouldRender ? (
                          <Style.KanbanMaintenanceWrapper key={maintenance.id}>
                            <Style.MaintenanceInfo
                              status={
                                card.status === 'Em execução' ? 'inProgress' : maintenance.status
                              }
                              onClick={() => {
                                const modal = ['pending', 'expired'].includes(maintenance.status)
                                  ? 'modalMaintenanceReportSend'
                                  : 'modalMaintenanceDetails';

                                setModalAdditionalInformations({
                                  id: maintenance.id,
                                  expectedNotificationDate: '',
                                  expectedDueDate: '',
                                  isFuture: false,
                                });
                                handleMaintenanceHistoryIdChange(maintenance.id);
                                handleModals(modal, true);
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h5>{maintenance?.buildingName}</h5>
                                <EventTag
                                  label={`#${maintenance.serviceOrderNumber}`}
                                  color={theme.color.gray4}
                                  bgColor="transparent"
                                  fontWeight="bold"
                                />
                              </div>

                              <h6>
                                <span>
                                  <Style.EventsWrapper>
                                    <EventTag status={maintenance.type} />
                                    {maintenance.status === 'pending' &&
                                      new Date(maintenance.date) >
                                        new Date(new Date().setHours(0, 0, 0, 0)) && (
                                        <FutureMaintenanceTag />
                                      )}
                                    {maintenance.status === 'overdue' && (
                                      <EventTag status="overdue" />
                                    )}
                                  </Style.EventsWrapper>
                                  <EventTag
                                    label={maintenance.priorityLabel}
                                    color={theme.color.gray4}
                                    bgColor="transparent"
                                    fontWeight="bold"
                                  />
                                </span>
                                {maintenance.element || maintenance.name}
                              </h6>

                              <p className="p2">
                                {maintenance.activity || maintenance.checklistProgress}
                              </p>
                              <p className="p3">
                                {maintenance.status === 'pending' && maintenance.label}
                                {maintenance.status === 'expired' &&
                                  !isOldExpired &&
                                  maintenance.label}
                                {(maintenance.status === 'completed' ||
                                  maintenance.status === 'overdue') &&
                                  `Concluída em ${dateFormatter(maintenance.date)}`}
                              </p>
                            </Style.MaintenanceInfo>
                          </Style.KanbanMaintenanceWrapper>
                        ) : null;
                      })}

                    {!loading &&
                      (card.maintenances.length === 0 ||
                        (!showFutureMaintenances &&
                          card.maintenances.every(
                            (maintenance) =>
                              maintenance.status === 'pending' &&
                              !maintenance.inProgress &&
                              new Date(maintenance.date) >
                                new Date(new Date().setHours(0, 0, 0, 0)),
                          )) ||
                        (!showOldExpireds &&
                          card.maintenances.every(
                            (maintenance) => maintenance.cantReportExpired === true,
                          ))) && (
                        <Style.NoDataContainer>
                          <h4>Nenhuma manutenção encontrada.</h4>
                        </Style.NoDataContainer>
                      )}
                  </Style.KanbanCard>
                ))}
          </Style.Kanban>
        ) : (
          <Style.ListView>
            {loading
              ? ['a', 'b', 'c', 'd'].map((id) => (
                  <Style.SkeltonListItem key={`skeleton-list-${id}`}>
                    <Skeleton height="42px" />
                  </Style.SkeltonListItem>
                ))
              : kanban?.map((card) => {
                  const isExpanded = expandedColumns.includes(card.status);

                  const filteredMaintenances = card.maintenances.filter((maintenance) => {
                    const isPending = maintenance.status === 'pending';
                    const isFuture =
                      new Date(maintenance.date) > new Date(new Date().setHours(0, 0, 0, 0));
                    const showExpiredOccasional =
                      maintenance.type === 'occasional' && maintenance.status === 'expired';
                    const isExpired = maintenance.status === 'expired';
                    const isOldExpired =
                      maintenance.status === 'expired' && maintenance.cantReportExpired;
                    const { inProgress } = maintenance;

                    return (
                      (((showFutureMaintenances && isPending && isFuture) ||
                        (isPending && !isFuture) ||
                        !isPending) &&
                        ((showOldExpireds && isExpired && isOldExpired) ||
                          (isExpired && !isOldExpired) ||
                          !isExpired)) ||
                      showExpiredOccasional ||
                      inProgress
                    );
                  });

                  return (
                    <Style.KanbanCardList key={card.status}>
                      <Style.KanbanHeader
                        status={card.status}
                        viewMode={viewMode}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleColumn(card.status)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Style.Chevron $expanded={isExpanded} />
                          <h5>
                            {card.status === 'Vencidas' ? 'Vencidas/Expiradas' : card.status} (
                            {
                              maintenancesLength[
                                handleTranslate({ key: card.status, plural: true }) || 0
                              ]
                            }
                            )
                          </h5>
                        </div>

                        {card.status === 'Vencidas' && (
                          <label htmlFor="showExpireds">
                            <input
                              type="checkbox"
                              id="showExpireds"
                              checked={showOldExpireds}
                              onChange={() => setShowOldExpireds((prev) => !prev)}
                            />
                            Mostrar expiradas
                          </label>
                        )}

                        {card.status === 'Pendentes' && (
                          <label htmlFor="showFuture">
                            <input
                              type="checkbox"
                              id="showFuture"
                              checked={showFutureMaintenances}
                              onChange={() => {
                                if (showFutureMaintenances) {
                                  setShowFutureMaintenances(false);
                                  setMaintenancesLength((prevState) => ({
                                    ...prevState,
                                    pending: prevState.pending - prevState.future,
                                  }));
                                } else {
                                  setShowFutureMaintenances(true);
                                  setMaintenancesLength((prevState) => ({
                                    ...prevState,
                                    pending: prevState.pending + prevState.future,
                                  }));
                                }
                              }}
                            />
                            Mostrar futuras
                          </label>
                        )}
                      </Style.KanbanHeader>

                      {isExpanded &&
                        (filteredMaintenances.length > 0 ? (
                          filteredMaintenances.map((maintenance) => (
                            <Style.ListItem key={maintenance.id}>
                              <Style.MaintenanceInfo
                                status={maintenance.status}
                                onClick={() => {
                                  const modal = ['pending', 'expired'].includes(maintenance.status)
                                    ? 'modalMaintenanceReportSend'
                                    : 'modalMaintenanceDetails';

                                  setModalAdditionalInformations({
                                    id: maintenance.id,
                                    expectedNotificationDate: '',
                                    expectedDueDate: '',
                                    isFuture: false,
                                  });
                                  handleMaintenanceHistoryIdChange(maintenance.id);
                                  handleModals(modal, true);
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <h5>{maintenance?.buildingName}</h5>
                                  <EventTag
                                    label={`#${maintenance.serviceOrderNumber}`}
                                    color={theme.color.gray4}
                                    bgColor="transparent"
                                    fontWeight="bold"
                                  />
                                </div>

                                <h6>
                                  <span>
                                    <Style.EventsWrapper>
                                      <EventTag status={maintenance.type} />
                                      {maintenance.status === 'pending' &&
                                        new Date(maintenance.date) >
                                          new Date(new Date().setHours(0, 0, 0, 0)) && (
                                          <FutureMaintenanceTag />
                                        )}
                                      {maintenance.status === 'overdue' && (
                                        <EventTag status="overdue" />
                                      )}
                                    </Style.EventsWrapper>
                                    <EventTag
                                      label={maintenance.priorityLabel}
                                      color={theme.color.gray4}
                                      bgColor="transparent"
                                      fontWeight="bold"
                                    />
                                  </span>
                                  {maintenance.element || maintenance.name}
                                </h6>

                                <p className="p2">
                                  {maintenance.activity || maintenance.checklistProgress}
                                </p>
                                <p className="p3">
                                  {maintenance.status === 'pending' && maintenance.label}
                                  {maintenance.status === 'expired' &&
                                    !(
                                      maintenance.status === 'expired' &&
                                      maintenance.cantReportExpired
                                    ) &&
                                    maintenance.label}
                                  {(maintenance.status === 'completed' ||
                                    maintenance.status === 'overdue') &&
                                    `Concluída em ${dateFormatter(maintenance.date)}`}
                                </p>
                              </Style.MaintenanceInfo>
                            </Style.ListItem>
                          ))
                        ) : (
                          <Style.NoDataContainer>
                            <h4>Nenhuma manutenção encontrada.</h4>
                          </Style.NoDataContainer>
                        ))}
                    </Style.KanbanCardList>
                  );
                })}
          </Style.ListView>
        )}
      </Style.Container>
    </>
  );
};
