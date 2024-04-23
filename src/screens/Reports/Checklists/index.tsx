/* eslint-disable react/no-array-index-key */
// #region imports
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import * as yup from 'yup';
import { Api } from '../../../services/api';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Button } from '../../../components/Buttons/Button';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { icon } from '../../../assets/icons';
import * as s from './styles';
import { theme } from '../../../styles/theme';
import { FormikInput } from '../../../components/Form/FormikInput';
import { ICounts, IFilterData, IFiltersOptions, IChecklists } from './types';
import {
  applyMask,
  capitalizeFirstLetter,
  catchHandler,
  dateFormatter,
} from '../../../utils/functions';
import { Select } from '../../../components/Inputs/Select';
import {
  getPluralStatusNameforPdf,
  getSingularStatusNameforPdf,
} from './ModalPrintChecklists/functions';
import { ReportDataTable, ReportDataTableContent } from '../Maintenances/ReportDataTable';
import { ListTag } from '../../../components/ListTag';
// #endregion

export const ChecklistReports = () => {
  // #region states
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [counts, setCounts] = useState<ICounts>({
    completed: 0,
    expired: 0,
    pending: 0,
    totalCost: 0,
  });

  const [checklists, setChecklists] = useState<IChecklists[]>([]);
  const [filtersOptions, setFiltersOptions] = useState<IFiltersOptions | undefined>();

  // const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);

  // const [filterforPDF, setFilterForPDF] = useState<IFilterforPDF>({
  //   buildingNames: '',
  //   endDate: '',
  //   startDate: '',
  //   statusNames: '',
  // });

  const [buildingsForFilter, setBuildingsForFilter] = useState<IFilterData[]>([]);
  const [statusForFilter, setStatusForFilter] = useState<IFilterData[]>([]);
  // #endregion

  // #region csv
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

  const csvData = [];

  // const csvData = checklists.map((data) => ({
  //   Edificação: data.buildingName,
  //   Status: getSingularStatusNameforPdf(data.status),
  //   'Data de notificação': dateFormatter(data.notificationDate),
  //   'Data de conclusão': data.resolutionDate ? dateFormatter(data.resolutionDate) : '',
  //   Categoria: data.categoryName,
  //   Elemento: data.element,
  //   Atividade: data.activity,
  //   Fonte: data.source,
  //   'Observação da manutenção': data.maintenanceObservation || '',
  //   Responsável: data.responsible,
  //   'Valor (R$)': data.cost ? data.cost / 100 : 0,
  //   'Observação do relato': data.reportObservation || '',
  //   Anexos: data.annexes.map(({ url }) => url).join('; '),
  //   Imagens: data.images.map(({ url }) => url).join('; '),
  // }));
  // #endregion

  // #region functions
  const requestReportsData = async () => {
    setOnQuery(true);
    setChecklists([]);
    await Api.get(`/checklists/reports`)
      .then((res) => {
        setChecklists(res.data.checklists);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
        setOnQuery(false);
      });
  };

  const schemaReportFilter = yup
    .object({
      maintenanceStatusId: yup.string(),
      responsibleSyndicId: yup.string(),
      startDate: yup.date().required('A data inicial é obrigatória.'),
      endDate: yup
        .date()
        .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
        .required('A data final é obrigatória.'),
    })
    .required();

  // #endregion

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {/* {modalPrintReportOpen && (
        <ModalPrintReport
          setModal={setModalPrintReportOpen}
          maintenancesForPDF={maintenancesForPDF}
          filterforPDF={filterforPDF}
          counts={counts}
        />
      )} */}

      <s.Container>
        <h2>Relatórios de checklists</h2>
        <s.FiltersContainer>
          <h5>Filtros</h5>
          <Formik
            initialValues={{
              maintenanceStatusId: '',
              startDate: '',
              endDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              console.log('values:', values);
              setShowNoDataMessage(true);

              // setFilterForPDF((prevState) => {
              //   const newState = { ...prevState };

              //   newState.buildingNames = buildingsForFilter.map((e) => e.name).join(', ');

              //   newState.statusNames = statusForFilter
              //     .map((e) => getPluralStatusNameforPdf(e.name))
              //     .join(', ');

              //   newState.startDate = values.startDate;

              //   newState.endDate = values.endDate;

              //   return newState;
              // });

              await requestReportsData();
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
                        onClick={() => checklists.length !== 0}
                      >
                        <IconButton
                          icon={icon.csvLogo}
                          label="Exportar"
                          color={theme.color.primary}
                          size="20px"
                          onClick={() => {
                            //
                          }}
                          disabled={checklists.length === 0}
                        />
                      </CSVLink>
                      <IconButton
                        icon={icon.pdfLogo}
                        label="Exportar"
                        color={theme.color.primary}
                        size="20px"
                        onClick={() => {
                          // setModalPrintReportOpen(true);
                        }}
                        disabled={checklists.length === 0}
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

        {!onQuery && checklists.length === 0 && showNoDataMessage && (
          <s.NoMaintenanceCard>
            <h4>Nenhuma manutenção encontrada.</h4>
          </s.NoMaintenanceCard>
        )}

        {!onQuery && checklists.length > 0 && (
          <>
            <s.CountContainer>
              <s.Counts>
                <s.CountsInfo>
                  <h5 className="completed">{counts.completed}</h5>
                  <p className="p5">{counts.completed > 1 ? 'Concluídas' : 'Concluída'}</p>
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
                { label: 'Status' },
                { label: 'Edificação' },
                { label: 'Nome' },
                { label: 'Descrição' },
                { label: 'Responsável' },
                { label: 'Periodicidade' },
                { label: 'Data' },
              ]}
            >
              {checklists?.map((checklist) => (
                <ReportDataTableContent
                  key={checklist.id}
                  colsBody={[
                    { cell: <ListTag label={checklist.status} />, cssProps: { width: '81px' } },
                    { cell: checklist.building.name },
                    { cell: checklist.name },
                    { cell: checklist.description },
                    { cell: checklist.syndic.name },
                    { cell: checklist.frequency ? 'Sim' : 'Não' },
                    { cell: dateFormatter(checklist.date) },
                  ]}
                  onClick={() => {
                    // setMaintenanceHistoryId(maintenance.maintenanceHistoryId);
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
