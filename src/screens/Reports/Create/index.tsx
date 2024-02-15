/* eslint-disable react/no-array-index-key */
// #region imports
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Button } from '../../../components/Buttons/Button';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { icon } from '../../../assets/icons';
import * as s from './styles';
import { theme } from '../../../styles/theme';
import { FormikInput } from '../../../components/Form/FormikInput';
import { requestReportsData, requestReportsDataForSelect, schemaReportFilter } from './functions';
import {
  ICounts,
  IFilterData,
  IFilterforPDF,
  IFilterforRequest,
  IFiltersOptions,
  IMaintenanceForPDF,
  IMaintenanceReportData,
} from './types';
import { applyMask, capitalizeFirstLetter, dateFormatter } from '../../../utils/functions';
import { ReportDataTable, ReportDataTableContent } from './ReportDataTable';
import { EventTag } from '../../Calendar/utils/EventTag';
import { ModalMaintenanceDetails } from './ModalMaintenanceDetails';
import { ModalPrintReport } from './ModalPrintReport';
import { ModalEditMaintenanceReport } from './ModalEditMaintenanceReport';
import { ModalSendMaintenanceReport } from './ModalSendMaintenanceReport';
import { Select } from '../../../components/Inputs/Select';
import {
  getPluralStatusNameforPdf,
  getSingularStatusNameforPdf,
} from './ModalPrintReport/functions';
import { InProgressTag } from '../../../components/InProgressTag';
// #endregion

export const CreateReport = () => {
  // #region states
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [counts, setCounts] = useState<ICounts>({
    completed: 0,
    expired: 0,
    pending: 0,
    totalCost: 0,
  });
  const [maintenances, setMaintenances] = useState<IMaintenanceReportData[]>([]);
  const [maintenancesForPDF, setMaintenancesForPDF] = useState<IMaintenanceForPDF[]>([]);

  const [filtersOptions, setFiltersOptions] = useState<IFiltersOptions | undefined>();

  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalEditReport, setModalEditReport] = useState<boolean>(false);

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');

  const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);

  const [modalSendMaintenanceReportOpen, setModalSendMaintenanceReportOpen] =
    useState<boolean>(false);

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);

  const [filterforPDF, setFilterForPDF] = useState<IFilterforPDF>({
    buildingNames: '',
    categoryNames: '',
    endDate: '',
    startDate: '',
    statusNames: '',
  });

  const [filterforRequest, setFilterforRequest] = useState<IFilterforRequest>({
    startDate: '',
    endDate: '',
    maintenanceStatusIds: [],
    categoryNames: [],
    buildingIds: [],
  });

  const [buildingsForFilter, setBuildingsForFilter] = useState<IFilterData[]>([]);

  const [categoriesForFilter, setCategoriesForFilter] = useState<IFilterData[]>([]);

  const [statusForFilter, setStatusForFilter] = useState<IFilterData[]>([]);
  // #endregion

  const csvHeaders = [
    { label: 'Edificação', key: 'Edificação' },
    { label: 'Status', key: 'Status' },
    { label: 'Data de notificação', key: 'Data de notificação' },
    { label: 'Data de conclusão', key: 'Data de conclusão' },
    { label: 'Categoria', key: 'Categoria' },
    { label: 'Elemento', key: 'Elemento' },
    { label: 'Atividade', key: 'Atividade' },
    { label: 'Fonte', key: 'Fonte' },
    { label: 'Observação da manutenção', key: 'Observação da manutenção' },
    { label: 'Responsável', key: 'Responsável' },
    { label: 'Valor (R$)', key: 'Valor (R$)' },
    { label: 'Observação do relato', key: 'Observação do relato' },
    { label: 'Anexos', key: 'Anexos' },
    { label: 'Imagens', key: 'Imagens' },
  ];

  const csvData = maintenances.map((data) => ({
    Edificação: data.buildingName,
    Status: getSingularStatusNameforPdf(data.status),
    'Data de notificação': dateFormatter(data.notificationDate),
    'Data de conclusão': data.resolutionDate ? dateFormatter(data.resolutionDate) : '',
    Categoria: data.categoryName,
    Elemento: data.element,
    Atividade: data.activity,
    Fonte: data.source,
    'Observação da manutenção': data.maintenanceObservation || '',
    Responsável: data.responsible,
    'Valor (R$)': data.cost ? data.cost / 100 : 0,
    'Observação do relato': data.reportObservation || '',
    Anexos: data.annexes.map(({ url }) => url).join('; '),
    Imagens: data.images.map(({ url }) => url).join('; '),
  }));

  useEffect(() => {
    requestReportsDataForSelect({ setFiltersOptions, setLoading });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalMaintenanceDetails && (
        <ModalMaintenanceDetails
          setModal={setModalMaintenanceDetails}
          maintenanceHistoryId={maintenanceHistoryId}
          setModalEditReport={setModalEditReport}
        />
      )}

      {modalSendMaintenanceReportOpen && maintenanceHistoryId && (
        <ModalSendMaintenanceReport
          setModal={setModalSendMaintenanceReportOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          onThenRequest={async () =>
            requestReportsData({
              filters: filterforRequest,
              setCounts,
              setLoading,
              setMaintenances,
              setOnQuery,
              setMaintenancesForPDF,
            })
          }
        />
      )}

      {modalEditReport && maintenanceHistoryId && (
        <ModalEditMaintenanceReport
          onThenActionRequest={async () =>
            requestReportsData({
              filters: filterforRequest,
              setCounts,
              setLoading,
              setMaintenances,
              setOnQuery,
              setMaintenancesForPDF,
            })
          }
          setModal={setModalEditReport}
          maintenanceHistoryId={maintenanceHistoryId}
        />
      )}

      {modalPrintReportOpen && (
        <ModalPrintReport
          setModal={setModalPrintReportOpen}
          maintenancesForPDF={maintenancesForPDF}
          filterforPDF={filterforPDF}
        />
      )}

      <s.Container>
        <h2>Relatórios TIRAR AS DATA PADRÃO DEPOIS *************************</h2>
        <s.FiltersContainer>
          <h5>Filtros</h5>
          <Formik
            initialValues={{
              maintenanceStatusId: '',
              startDate: '2020-01-01',
              endDate: '2025-01-01',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              setShowNoDataMessage(true);

              setFilterforRequest({
                buildingIds: buildingsForFilter.map((e) => e.id),
                categoryNames: categoriesForFilter.map((e) => e.name),
                maintenanceStatusIds: statusForFilter.map((e) => e.id),
                endDate: values.endDate,
                startDate: values.startDate,
              });

              setFilterForPDF((prevState) => {
                const newState = { ...prevState };

                newState.buildingNames = buildingsForFilter.map((e) => e.name).join(', ');

                newState.categoryNames = categoriesForFilter.map((e) => e.name).join(', ');

                newState.statusNames = statusForFilter
                  .map((e) => getPluralStatusNameforPdf(e.name))
                  .join(', ');

                newState.startDate = values.startDate;

                newState.endDate = values.endDate;

                return newState;
              });

              await requestReportsData({
                setOnQuery,
                setCounts,
                setMaintenances,
                setLoading,
                filters: {
                  buildingIds: buildingsForFilter.map((e) => e.id),
                  categoryNames: categoriesForFilter.map((e) => e.name),
                  maintenanceStatusIds: statusForFilter.map((e) => e.id),
                  startDate: values.startDate,
                  endDate: values.endDate,
                },
                setMaintenancesForPDF,
              });
            }}
          >
            {({ errors, values, touched }) => (
              <Form>
                <s.FiltersGrid>
                  <Select
                    selectPlaceholderValue={buildingsForFilter.length > 0 ? ' ' : ''}
                    label="Edificação"
                    value=""
                    onChange={(e) => {
                      const selectedBuilding = filtersOptions?.buildings.find(
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

                    {filtersOptions?.buildings.map((building) => (
                      <option
                        key={building.id}
                        value={building.id}
                        disabled={buildingsForFilter.some((e) => e.id === building.id)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={categoriesForFilter.length > 0 ? ' ' : ''}
                    label="Categoria"
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
                      Todas
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

                  <FormikInput
                    label="Data de notificação inicial"
                    typeDatePlaceholderValue={values.startDate}
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    label="Data de notificação final"
                    typeDatePlaceholderValue={values.endDate}
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />
                  <s.TagWrapper>
                    {buildingsForFilter.length === 0 && (
                      <s.Tag>
                        <p className="p3">Todas as edificações</p>
                      </s.Tag>
                    )}

                    {buildingsForFilter.map((building, i: number) => (
                      <s.Tag key={building.id}>
                        <p className="p3">{building.name}</p>
                        <IconButton
                          size="14px"
                          icon={icon.xBlack}
                          onClick={() => {
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
                  </s.TagWrapper>
                  <s.ButtonContainer>
                    <s.ButtonWrapper>
                      <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`Relatório ${new Date().toLocaleDateString('pt-BR')}`}
                        onClick={() => maintenances.length !== 0}
                      >
                        <IconButton
                          icon={icon.csvLogo}
                          label="Exportar"
                          color={theme.color.primary}
                          size="20px"
                          onClick={() => {
                            //
                          }}
                          disabled={maintenances.length === 0}
                        />
                      </CSVLink>
                      <IconButton
                        icon={icon.pdfLogo}
                        label="Exportar"
                        color={theme.color.primary}
                        size="20px"
                        onClick={() => {
                          setModalPrintReportOpen(true);
                        }}
                        disabled={maintenances.length === 0}
                      />
                      <Button label="Filtrar" type="submit" disabled={onQuery} />
                    </s.ButtonWrapper>
                  </s.ButtonContainer>
                </s.FiltersGrid>
              </Form>
            )}
          </Formik>
        </s.FiltersContainer>

        {onQuery && <DotSpinLoading />}

        {!onQuery && maintenances.length === 0 && showNoDataMessage && (
          <s.NoMaintenanceCard>
            <h4>Nenhuma manutenção encontrada.</h4>
          </s.NoMaintenanceCard>
        )}

        {!onQuery && maintenances.length > 0 && (
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

              <p className="p3">
                Total: {applyMask({ value: String(counts.totalCost), mask: 'BRL' }).value}
              </p>
            </s.CountContainer>
            <ReportDataTable
              colsHeader={[
                { label: 'Status' },
                { label: 'Edificação' },
                { label: 'Categoria' },
                { label: 'Elemento' },
                { label: 'Atividade' },
                { label: 'Responsável' },
                { label: 'Data de notificação' },
                { label: 'Valor' },
              ]}
            >
              {maintenances?.map((maintenance) => (
                <ReportDataTableContent
                  key={maintenance.id}
                  colsBody={[
                    {
                      cell: (
                        <s.TagContainer>
                          {maintenance.status === 'overdue' && <EventTag status="completed" />}
                          <EventTag status={maintenance.status} />
                          {maintenance.type === 'occasional' && <EventTag status="occasional" />}
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
                        maintenance.cost !== null
                          ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                          : '-',
                    },
                  ]}
                  onClick={() => {
                    setMaintenanceHistoryId(maintenance.maintenanceHistoryId);

                    if (maintenance.status === 'pending' || maintenance.status === 'expired') {
                      setModalSendMaintenanceReportOpen(true);
                    }

                    if (maintenance.status === 'completed' || maintenance.status === 'overdue') {
                      setModalMaintenanceDetails(true);
                    }
                  }}
                />
              ))}
            </ReportDataTable>
          </>
        )}
      </s.Container>
    </>
  );
};
