/* eslint-disable react/no-array-index-key */
// REACT
import { useEffect, useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Select } from '@components/Inputs/Select';
import { FormikSelect } from '@components/Form/FormikSelect';
import { InProgressTag } from '@components/InProgressTag';
import { ListTag } from '@components/ListTag';
import { PdfList } from '@components/PdfList';
import { EventTag } from '@components/EventTag';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';

// GLOBAL UTILS
import { applyMask, capitalizeFirstLetter, catchHandler, dateFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconCsvLogo from '@assets/icons/IconCsvLogo';
import IconPdfLogo from '@assets/icons/IconPdfLogo';

// GLOBAL TYPES
import { MAINTENANCE_TYPE } from '@customTypes/TMaintenanceType';
import type { IReportPdf } from '@customTypes/IReportPdf';
import type { TModalNames } from '@customTypes/TModalNames';

// COMPONENTS
import { handleToastify } from '@utils/toastifyResponses';
import { ReportDataTable, ReportDataTableContent } from './ReportDataTable';

// UTILS
import { requestReportsData, requestReportsDataForSelect, schemaReportFilter } from './functions';
import {
  getPluralStatusNameforPdf,
  getSingularStatusNameforPdf,
} from './ModalPrintReport/functions';

// STYLES
import * as s from './styles';

//  TYPES
import type {
  ICounts,
  IFilterData,
  IFilterforRequest,
  IFiltersOptions,
  IMaintenanceReportData,
} from './types';
import type { IModalAdditionalInformations } from '../../Calendar/types';

export const MaintenanceReports = () => {
  // #region states
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');
  const [modalAdditionalInformations, setModalAdditionalInformations] =
    useState<IModalAdditionalInformations>({
      id: '',
      expectedNotificationDate: '',
      expectedDueDate: '',
      isFuture: false,
    });

  const [counts, setCounts] = useState<ICounts>({
    completed: 0,
    expired: 0,
    pending: 0,
    totalCost: 0,
  });

  const [maintenances, setMaintenances] = useState<IMaintenanceReportData[]>([]);
  const [maintenanceReportPdfs, setMaintenanceReportPdfs] = useState<IReportPdf[]>([]);

  const [filtersOptions, setFiltersOptions] = useState<IFiltersOptions | undefined>();

  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);

  const [filterforRequest, setFilterforRequest] = useState<IFilterforRequest>({
    startDate: '',
    endDate: '',
    maintenanceStatusIds: [],
    categoryNames: [],
    buildingIds: [],
    buildingNames: [],
    maintenanceStatusNames: [],
    type: [],
    search: '',
    filterBy: 'notificationDate',
  });

  const [buildingsForFilter, setBuildingsForFilter] = useState<IFilterData[]>([]);
  const [categoriesForFilter, setCategoriesForFilter] = useState<IFilterData[]>([]);
  const [statusForFilter, setStatusForFilter] = useState<IFilterData[]>([]);
  const [typeForFilter, setTypeForFilter] = useState<string[]>([]);

  const [reportView, setReportView] = useState<'reports' | 'pdfs'>('reports');

  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onPdfQuery, setOnPdfQuery] = useState<boolean>(false);

  // #endregion

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleModals = (modal: TModalNames, modalState: boolean) => {
    switch (modal) {
      case 'modalMaintenanceReportSend':
        setModalMaintenanceReportSend(modalState);
        break;
      case 'modalMaintenanceDetails':
        setModalMaintenanceDetails(modalState);
        break;

      default:
        break;
    }
  };

  // #region csv
  const csvHeaders = [
    { label: 'Edificação', key: 'Edificação' },
    { label: 'Status', key: 'Status' },
    { label: 'Data de notificação', key: 'Data de notificação' },
    { label: 'Data de vencimento', key: 'Data de vencimento' },
    { label: 'Data de conclusão', key: 'Data de conclusão' },
    { label: 'Categoria', key: 'Categoria' },
    { label: 'Elemento', key: 'Elemento' },
    { label: 'Atividade', key: 'Atividade' },
    { label: 'Fonte', key: 'Fonte' },
    { label: 'Observação da manutenção', key: 'Observação da manutenção' },
    { label: 'Responsável', key: 'Responsável' },
    { label: 'Valor (R$)', key: 'Valor (R$)' },
    // { label: 'Observação do relato', key: 'Observação do relato' },
    { label: 'Anexos', key: 'Anexos' },
    { label: 'Imagens', key: 'Imagens' },
  ];

  const csvData = maintenances.map((data) => ({
    Edificação: data.buildingName,
    Status: getSingularStatusNameforPdf(data.status),
    'Data de notificação': dateFormatter(data.notificationDate),
    'Data de vencimento': data.type === 'common' ? dateFormatter(data.dueDate) : '-',
    'Data de conclusão': data.resolutionDate ? dateFormatter(data.resolutionDate) : '',
    Categoria: data.categoryName,
    Elemento: data.element,
    Atividade: data.activity,
    Fonte: data.source,
    'Observação da manutenção': data.maintenanceObservation || '',
    Responsável: data.responsible,
    'Valor (R$)': data.cost ? data.cost / 100 : 0,
    // 'Observação do relato': data.reportObservation || '',
    Anexos: data?.annexes?.map(({ url }) => url).join('; '),
    Imagens: data?.images?.map(({ url }) => url).join('; '),
  }));
  // #endregion

  // #region api functions
  const requestPdf = async () => {
    setOnPdfQuery(true);

    const params = {
      maintenanceStatusIds: filterforRequest.maintenanceStatusIds,
      buildingIds: filterforRequest.buildingIds,
      categoryNames: filterforRequest.categoryNames,
      startDate: filterforRequest.startDate,
      endDate: filterforRequest.endDate,
      buildingNames: filterforRequest.buildingNames,
      maintenanceStatusNames: filterforRequest.maintenanceStatusNames,
      filterBy: filterforRequest.filterBy,
      search: filterforRequest.search,
      type: filterforRequest.type.join(','),
    };

    await Api.get(`/buildings/reports/create/pdf`, { params })
      .then((res) => {
        handleToastify(res);
      })
      .catch((err: any) => {
        handleToastify(err.response);
      })
      .finally(() => {
        setOnPdfQuery(false);
      });
  };

  const requestReportPdfs = async () => {
    setLoading(true);

    await Api.get(`/buildings/reports/list/pdf`)
      .then((res) => {
        setMaintenanceReportPdfs(res.data.pdfs);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // #endregion

  useEffect(() => {
    requestReportsDataForSelect({ setFiltersOptions, setLoading });
    requestReportPdfs();
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
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
        />
      )}

      <s.Container>
        <h2>Relatórios de manutenções</h2>

        <s.FiltersContainer>
          <Formik
            initialValues={{
              maintenanceStatusId: '',
              search: '',
              filterBy: 'allActivities',
              startDate: '',
              endDate: '',
              endDueDate: '',
              startDueDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              setShowNoDataMessage(true);

              setFilterforRequest({
                buildingIds: buildingsForFilter.map((e) => e.id),
                buildingNames: buildingsForFilter.map((e) => e.name),
                categoryNames: categoriesForFilter.map((e) => e.name),
                maintenanceStatusIds: statusForFilter.map((e) => e.id),
                maintenanceStatusNames: statusForFilter.map((e) => e.name),
                search: values.search,
                filterBy: values.filterBy,
                type: typeForFilter,
                endDate: values.endDate,
                startDate: values.startDate,
              });

              await requestReportsData({
                setOnQuery,
                setCounts,
                setMaintenances,
                setLoading,
                filters: {
                  buildingIds: buildingsForFilter.map((e) => e.id),
                  buildingNames: buildingsForFilter.map((e) => e.name),
                  categoryNames: categoriesForFilter.map((e) => e.name),
                  maintenanceStatusIds: statusForFilter.map((e) => e.id),
                  maintenanceStatusNames: statusForFilter.map((e) => e.name),
                  endDate: values.endDate,
                  startDate: values.startDate,
                  search: values.search,
                  filterBy: values.filterBy,
                  type: typeForFilter,
                },
              });
            }}
          >
            {({ errors, values, touched, setFieldValue }) => (
              <Form>
                <s.FiltersGrid>
                  <FormikSelect
                    name="buildingId"
                    selectPlaceholderValue={buildingsForFilter.length > 0 ? ' ' : ''}
                    label="Edificação"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      const selectedBuilding = buildingsForSelect.find(
                        (building) => building.id === e.target.value,
                      );

                      if (selectedBuilding) {
                        setBuildingsForFilter((prevState) => [
                          ...prevState,
                          { id: selectedBuilding.id, name: selectedBuilding.name },
                        ]);
                      }

                      if (e.target.value === 'all') {
                        setBuildingsForFilter([]);
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={buildingsForFilter.length === 0}>
                      Todas
                    </option>

                    {buildingsForSelect.map((building) => (
                      <option
                        key={building.id}
                        value={building.id}
                        disabled={buildingsForFilter.some((e) => e.id === building.id)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </FormikSelect>

                  <Select
                    selectPlaceholderValue={categoriesForFilter.length > 0 ? ' ' : ''}
                    label="Categoria"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      const selectedCategory = filtersOptions?.categories.find(
                        (category) => category.id === e.target.value,
                      );

                      if (selectedCategory) {
                        setCategoriesForFilter((prevState) => [
                          ...prevState,
                          { id: selectedCategory.id, name: selectedCategory.name },
                        ]);
                      }

                      if (e.target.value === 'all') {
                        setCategoriesForFilter([]);
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>
                    <option value="all" disabled={categoriesForFilter.length === 0}>
                      Todas
                    </option>
                    {filtersOptions?.categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        disabled={categoriesForFilter.some((e) => e.id === category.id)}
                      >
                        {category.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={statusForFilter.length > 0 ? ' ' : ''}
                    label="Status"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      const selectedStatus = filtersOptions?.status.find(
                        (status) => status.id === e.target.value,
                      );

                      if (selectedStatus) {
                        setStatusForFilter((prevState) => [
                          ...prevState,
                          { id: selectedStatus.id, name: selectedStatus.name },
                        ]);
                      }

                      if (e.target.value === 'all') {
                        setStatusForFilter([]);
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>
                    <option value="all" disabled={statusForFilter.length === 0}>
                      Todos
                    </option>
                    {filtersOptions?.status.map((status) => (
                      <option
                        key={status.id}
                        value={status.id}
                        disabled={statusForFilter.some((e) => e.id === status.id)}
                      >
                        {capitalizeFirstLetter(status.pluralLabel)}
                      </option>
                    ))}
                  </Select>

                  <FormikSelect
                    id="maintenance-type-select"
                    label="Tipo de manutenção"
                    selectPlaceholderValue={typeForFilter.length > 0 ? ' ' : ''}
                    value=""
                    disabled={loading}
                    onChange={(e) => {
                      const selectedType = e.target.value;

                      if (selectedType) {
                        setTypeForFilter((prevState) => [...prevState, selectedType]);
                      }

                      if (selectedType === 'all') {
                        setTypeForFilter([]);
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={typeForFilter.length === 0}>
                      Todos
                    </option>

                    {MAINTENANCE_TYPE.map((maintenanceType) => (
                      <option
                        key={maintenanceType.value}
                        value={maintenanceType.value}
                        disabled={typeForFilter.includes(maintenanceType.value)}
                      >
                        {capitalizeFirstLetter(maintenanceType.label)}
                      </option>
                    ))}
                  </FormikSelect>
                </s.FiltersGrid>

                <s.FiltersSecondGrid>
                  <FormikInput
                    name="search"
                    label="Buscar"
                    placeholder="Procurar por algum termo"
                    value={values.search}
                  />

                  <FormikSelect
                    label="Filtrar por"
                    name="filterBy"
                    arrowColor="primary"
                    selectPlaceholderValue={values.filterBy}
                    error={touched.filterBy && errors.filterBy ? errors.filterBy : null}
                  >
                    <option value="allActivities">Todas as atividades</option>
                    <option value="notificationDate">Data de notificação</option>
                    <option value="dueDate">Data de vencimento</option>
                  </FormikSelect>

                  <FormikInput
                    label="Data inicial"
                    typeDatePlaceholderValue={values.startDate}
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    label="Data final"
                    typeDatePlaceholderValue={values.endDate}
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />

                  <s.TagWrapper>
                    {buildingsForFilter.map((building, i: number) => (
                      <s.Tag key={building.id}>
                        <p className="p3">{building.name}</p>
                        <IconButton
                          size="14px"
                          icon={icon.xBlack}
                          onClick={() => {
                            setFieldValue('buildingId', '');
                            setBuildingsForFilter((prevState) => {
                              const newState = [...prevState];
                              newState.splice(i, 1);
                              return newState;
                            });
                          }}
                        />
                      </s.Tag>
                    ))}

                    {categoriesForFilter.length === 0 && (
                      <s.Tag>
                        <p className="p3">Todas as categorias</p>
                      </s.Tag>
                    )}

                    {categoriesForFilter.map((category, i: number) => (
                      <s.Tag key={category.id}>
                        <p className="p3">{category.name}</p>
                        <IconButton
                          size="14px"
                          icon={icon.xBlack}
                          onClick={() => {
                            setCategoriesForFilter((prevState) => {
                              const newState = [...prevState];
                              newState.splice(i, 1);
                              return newState;
                            });
                          }}
                        />
                      </s.Tag>
                    ))}

                    {statusForFilter.length === 0 && (
                      <s.Tag>
                        <p className="p3">Todos os status</p>
                      </s.Tag>
                    )}

                    {statusForFilter.map((status, i: number) => (
                      <s.Tag key={status.id}>
                        <p className="p3">{getPluralStatusNameforPdf(status.name)}</p>
                        <IconButton
                          size="14px"
                          icon={icon.xBlack}
                          onClick={() => {
                            setStatusForFilter((prevState) => {
                              const newState = [...prevState];
                              newState.splice(i, 1);
                              return newState;
                            });
                          }}
                        />
                      </s.Tag>
                    ))}

                    {typeForFilter.length === 0 ? (
                      <ListTag
                        label="Todos os tipos"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    ) : (
                      typeForFilter.map((type, i: number) => (
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
                            setTypeForFilter((prevState) => {
                              const newState = [...prevState];
                              newState.splice(i, 1);
                              return newState;
                            });
                          }}
                        />
                      ))
                    )}
                  </s.TagWrapper>
                  <s.ButtonContainer>
                    <s.ButtonWrapper>
                      <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`Relatório de manutenções ${new Date().toLocaleDateString(
                          'pt-BR',
                        )}`}
                        onClick={() => maintenances.length !== 0}
                      >
                        <IconButton
                          label="Exportar"
                          icon={<IconCsvLogo strokeColor="primary" fillColor="" />}
                          disabled={maintenances.length === 0}
                          onClick={() => {
                            //
                          }}
                        />
                      </CSVLink>

                      <IconButton
                        label="Exportar"
                        icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
                        disabled={maintenances.length === 0 || onPdfQuery}
                        onClick={() => requestPdf()}
                      />

                      <Button label="Filtrar" type="submit" disable={onQuery} bgColor="primary" />
                    </s.ButtonWrapper>
                  </s.ButtonContainer>
                </s.FiltersSecondGrid>
              </Form>
            )}
          </Formik>
        </s.FiltersContainer>

        <s.ViewButtons>
          <s.CustomButton
            type="button"
            active={reportView === 'reports'}
            onClick={() => {
              setReportView('reports');
            }}
          >
            Relatório
          </s.CustomButton>
          <s.CustomButton
            type="button"
            active={reportView === 'pdfs'}
            onClick={() => {
              setReportView('pdfs');
            }}
          >
            Histórico de relatórios
          </s.CustomButton>
        </s.ViewButtons>

        {onQuery && <DotSpinLoading />}

        {reportView === 'reports' && !onQuery && maintenances.length > 0 && (
          <>
            <s.CountContainer>
              <s.Counts>
                {/* Não fiz .map pra facilitar a estilização */}
                <s.CountsInfo>
                  <h5 className="completed">{counts.completed}</h5>
                  <p className="p5">{counts.completed > 1 ? 'Concluídas' : 'Concluída'}</p>
                </s.CountsInfo>

                <s.CountsInfo>
                  <h5 className="pending">{counts.pending}</h5>
                  <p className="p5">{counts.pending > 1 ? 'Pendentes' : 'Pendente'}</p>
                </s.CountsInfo>

                <s.CountsInfo>
                  <h5 className="expired">{counts.expired}</h5>
                  <p className="p5">{counts.expired > 1 ? 'Vencidas' : 'Vencida'}</p>
                </s.CountsInfo>
              </s.Counts>

              <p className="p2">
                Total: {applyMask({ value: String(counts.totalCost), mask: 'BRL' }).value}
              </p>
            </s.CountContainer>
            <ReportDataTable
              colsHeader={[
                { label: ' ' },
                { label: 'Status' },
                { label: 'Edificação' },
                { label: 'Categoria' },
                { label: 'Elemento' },
                { label: 'Atividade' },
                { label: 'Responsável' },
                { label: 'Data de notificação' },
                { label: 'Data de vencimento' },
                { label: 'Valor' },
              ]}
            >
              {maintenances?.map((maintenance, i) => (
                <ReportDataTableContent
                  key={maintenance.id + i}
                  colsBody={[
                    {
                      cell: maintenance.serviceOrderNumber
                        ? `#${maintenance.serviceOrderNumber}`
                        : 'N/A',
                    },
                    {
                      cell: (
                        <s.TagContainer>
                          {maintenance.status === 'overdue' && <EventTag status="completed" />}
                          <EventTag status={maintenance.status} />
                          {maintenance.type === 'occasional' ? (
                            <EventTag status="occasional" />
                          ) : (
                            <EventTag status="common" />
                          )}
                          {(maintenance.status === 'expired' || maintenance.status === 'pending') &&
                            maintenance.inProgress && <InProgressTag />}
                        </s.TagContainer>
                      ),
                    },

                    { cell: maintenance.buildingName },
                    { cell: maintenance.categoryName },
                    { cell: maintenance.element },
                    { cell: maintenance.activity },
                    { cell: maintenance.responsible ?? 'Sem responsável cadastrado' },
                    { cell: dateFormatter(maintenance.notificationDate) },
                    {
                      cell:
                        maintenance.type === 'common' ? dateFormatter(maintenance.dueDate) : '-',
                    },
                    {
                      cell:
                        maintenance.cost !== null
                          ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                          : '-',
                    },
                  ]}
                  onClick={() => {
                    setMaintenanceHistoryId(maintenance.maintenanceHistoryId);
                    setModalAdditionalInformations({
                      expectedDueDate: maintenance.expectedDueDate || '',
                      expectedNotificationDate: maintenance.expectedNotificationDate || '',
                      id: maintenance.maintenanceHistoryId,
                      isFuture: maintenance.isFuture || false,
                    });

                    if (
                      (maintenance.status === 'completed' ||
                        maintenance.status === 'overdue' ||
                        maintenance.isFuture) &&
                      maintenance.id
                    ) {
                      handleModals('modalMaintenanceDetails', true);
                    } else if (!maintenance.isFuture && maintenance.id) {
                      handleModals('modalMaintenanceReportSend', true);
                    }
                  }}
                />
              ))}
            </ReportDataTable>
          </>
        )}

        {reportView === 'reports' && !onQuery && maintenances.length === 0 && showNoDataMessage && (
          <s.NoMaintenanceCard>
            <h4>Nenhuma manutenção encontrada.</h4>
          </s.NoMaintenanceCard>
        )}

        {reportView === 'pdfs' && (
          <PdfList
            reportType="maintenance"
            pdfList={maintenanceReportPdfs}
            loading={loading}
            handleRefreshPdf={requestReportPdfs}
          />
        )}
      </s.Container>
    </>
  );
};
