/* eslint-disable react/no-array-index-key */
// LIBS

// COMPONENTS
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Button } from '../../../components/Buttons/Button';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';

// STYLES
import { icon } from '../../../assets/icons';
import * as s from './styles';
import { theme } from '../../../styles/theme';
import { FormikInput } from '../../../components/Form/FormikInput';
import { FormikSelect } from '../../../components/Form/FormikSelect';
import { requestReportsData, requestReportsDataForSelect, schemaReportFilter } from './functions';
import {
  ICounts,
  IFilterData,
  IFilterforPDF,
  IFilterforRequest,
  IFiltersOptions,
  IMaintenanceReportData,
} from './types';
import { applyMask, capitalizeFirstLetter } from '../../../utils/functions';
import { ReportDataTable, ReportDataTableContent } from './ReportDataTable';
import { EventTag } from '../../Calendar/utils/EventTag';
import { ModalMaintenanceDetails } from './ModalMaintenanceDetails';
import { ModalPrintReport } from './ModalPrintReport';
import { ModalEditMaintenanceReport } from './ModalEditMaintenanceReport';
import { ModalSendMaintenanceReport } from './ModalSendMaintenanceReport';
import { Select } from '../../../components/Inputs/Select';

export const CreateReport = () => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [counts, setCounts] = useState<ICounts>({
    completed: 0,
    expired: 0,
    pending: 0,
    totalCost: 0,
  });
  const [maintenances, setMaintenances] = useState<IMaintenanceReportData[]>([]);

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
    categoryName: '',
    endDate: '',
    startDate: '',
    status: '',
  });

  const [filterforRequest, setFilterforRequest] = useState<IFilterforRequest>({
    maintenanceStatusId: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    buildingIds: [],
  });

  const [buildingsForFilter, setBuildingsForFilter] = useState<IFilterData[]>([]);

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
        />
      )}
      {modalSendMaintenanceReportOpen && maintenanceHistoryId && (
        <ModalSendMaintenanceReport
          setModal={setModalSendMaintenanceReportOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          filters={filterforRequest}
          setCounts={setCounts}
          setLoading={setLoading}
          setMaintenances={setMaintenances}
          setOnQuery={setOnQuery}
        />
      )}
      {modalEditReport && maintenanceHistoryId && (
        <ModalEditMaintenanceReport
          setModal={setModalEditReport}
          maintenanceHistoryId={maintenanceHistoryId}
          filters={filterforRequest}
          setCounts={setCounts}
          setLoading={setLoading}
          setMaintenances={setMaintenances}
          setOnQuery={setOnQuery}
        />
      )}
      {modalPrintReportOpen && (
        <ModalPrintReport
          setModal={setModalPrintReportOpen}
          maintenances={maintenances}
          filterforPDF={filterforPDF}
        />
      )}

      <s.Container>
        <h2>Relatórios</h2>

        <s.FiltersContainer>
          <h5>Filtros</h5>
          <Formik
            initialValues={{
              maintenanceStatusId: '',
              categoryId: '',
              startDate: '',
              endDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              setShowNoDataMessage(true);

              setFilterforRequest({
                buildingIds: buildingsForFilter.map((e) => e.id),
                categoryId: values.categoryId,
                endDate: values.endDate,
                maintenanceStatusId: values.maintenanceStatusId,
                startDate: values.startDate,
              });

              setFilterForPDF((prevState) => {
                const newState = { ...prevState };

                newState.buildingNames = buildingsForFilter.map((e) => e.name).join(', ');

                const category = filtersOptions?.categories.find((e) => e.id === values.categoryId);

                newState.categoryName = category?.name ? category?.name : '';

                newState.startDate = values.startDate;

                newState.endDate = values.endDate;

                const status = filtersOptions?.status.find(
                  (e) => e.id === values.maintenanceStatusId,
                );
                newState.status = status?.name ? status?.name : '';

                return newState;
              });

              await requestReportsData({
                setOnQuery,
                setCounts,
                setMaintenances,
                setLoading,
                filters: {
                  buildingIds: buildingsForFilter.map((e) => e.id),
                  categoryId: values.categoryId,
                  maintenanceStatusId: values.maintenanceStatusId,
                  startDate: values.startDate,
                  endDate: values.endDate,
                },
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

                  <FormikSelect
                    selectPlaceholderValue={values.categoryId}
                    name="categoryId"
                    label="Categoria"
                    error={touched.categoryId && errors.categoryId ? errors.categoryId : null}
                  >
                    <option value="">Todas</option>
                    {filtersOptions?.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </FormikSelect>

                  <FormikSelect
                    selectPlaceholderValue={values.maintenanceStatusId}
                    name="maintenanceStatusId"
                    label="Status"
                    error={
                      touched.maintenanceStatusId && errors.maintenanceStatusId
                        ? errors.maintenanceStatusId
                        : null
                    }
                  >
                    <option value="">Todos</option>
                    {filtersOptions?.status.map((status) => (
                      <option key={status.id} value={status.id}>
                        {capitalizeFirstLetter(status.pluralLabel)}
                      </option>
                    ))}
                  </FormikSelect>

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
                  </s.TagWrapper>
                  <s.ButtonContainer>
                    <s.ButtonWrapper>
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
                { label: 'Observação' },
                { label: 'Valor' },
              ]}
            >
              {maintenances?.map((maintenance) => (
                <ReportDataTableContent
                  key={maintenance.id}
                  colsBody={[
                    { cell: <EventTag status={maintenance.status} /> },

                    { cell: maintenance.buildingName },
                    { cell: maintenance.categoryName },
                    { cell: maintenance.element },
                    { cell: maintenance.activity },
                    { cell: maintenance.responsible ?? 'Sem responsável cadastrado' },
                    { cell: maintenance.observation ?? '-' },
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
                      setModalEditReport(true);
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
