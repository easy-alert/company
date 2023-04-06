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
import { ICounts, IFilterforPDF, IFiltersOptions, IMaintenanceReportData } from './types';
import { applyMask, capitalizeFirstLetter } from '../../../utils/functions';
import { ReportDataTable, ReportDataTableContent } from './ReportDataTable';
import { EventTag } from '../../Calendar/utils/EventTag';
import { ModalMaintenanceDetails } from './ModalMaintenanceDetails';
import { ModalPrintReport } from './ModalPrintReport';

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

  const [maintenceHistoryId, setMaintenanceHistoryId] = useState<string>('');

  const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);

  const [filterforPDF, setFilterForPDF] = useState<IFilterforPDF>({
    buildingName: '',
    categoryName: '',
    endDate: '',
    startDate: '',
    status: '',
  });

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
          maintenanceHistoryId={maintenceHistoryId}
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
              buildingId: '',
              categoryId: '',
              startDate: '',
              endDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              setShowNoDataMessage(true);

              setFilterForPDF((prevState) => {
                const newState = { ...prevState };

                const building = filtersOptions?.buildings.find((e) => e.id === values.buildingId);

                newState.buildingName = building?.name ? building?.name : '';

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
                  buildingId: values.buildingId,
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
                  <FormikSelect
                    selectPlaceholderValue={values.buildingId}
                    name="buildingId"
                    label="Edificação"
                    error={touched.buildingId && errors.buildingId ? errors.buildingId : null}
                  >
                    <option value="">Todos</option>

                    {filtersOptions?.buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </FormikSelect>

                  <FormikSelect
                    selectPlaceholderValue={values.categoryId}
                    name="categoryId"
                    label="Categoria"
                    error={touched.categoryId && errors.categoryId ? errors.categoryId : null}
                  >
                    <option value="">Todos</option>
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
                { label: 'Valor' },
              ]}
            >
              {maintenances?.map((maintenance, i) => (
                <ReportDataTableContent
                  key={maintenance.activity + i}
                  colsBody={[
                    { cell: <EventTag status={maintenance.status} /> },

                    { cell: maintenance.buildingName },
                    { cell: maintenance.categoryName },
                    { cell: maintenance.element },
                    { cell: maintenance.activity },
                    { cell: maintenance.responsible ?? 'Sem responsável cadastrado' },
                    {
                      cell:
                        maintenance.cost !== null
                          ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                          : '-',
                    },
                  ]}
                  onClick={() => {
                    setMaintenanceHistoryId(maintenance.maintenanceHistoryId);
                    setModalMaintenanceDetails(true);
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
