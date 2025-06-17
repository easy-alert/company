/* eslint-disable react/no-array-index-key */
// #region imports
// REACT
import { useEffect, useState } from 'react';
// import { CSVLink } from 'react-csv';

// LIBS
import { Form, Formik } from 'formik';
import * as yup from 'yup';

// SERVICES
import { Api } from '@services/api';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { ListTag } from '@components/ListTag';
import { PdfList } from '@components/PdfList';
import { EventTag } from '@components/EventTag';

// GLOBAL UTILS
import { catchHandler, dateFormatter } from '@utils/functions';

// GLOBAL ASSETS
// import { icon } from '@assets/icons';
// import IconCsvLogo from '@assets/icons/IconCsvLogo';
import IconPdfLogo from '@assets/icons/IconPdfLogo';

// GLOBAL TYPES
import type { IReportPdf } from '@customTypes/IReportPdf';
import type { IChecklist } from '@customTypes/IChecklist';

// COMPONENTS
import { getChecklistReports } from '@services/apis/getChecklistReports';
import { generateChecklistReportPDF } from '@services/apis/generateChecklistReportPDF';
import { ReportDataTable, ReportDataTableContent } from '../Maintenances/ReportDataTable';
import { ModalChecklistDetails } from '../../Checklists/ModalChecklistDetails';

// UTILS
import { getPluralStatusNameforPdf } from '../Maintenances/ModalPrintReport/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IChecklistFilterNames, ICounts, IFilterData } from './types';

// #endregion

export const ChecklistReports = () => {
  // #region states
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [checklists, setChecklists] = useState<IChecklist[]>([]);
  const [checklistId, setChecklistId] = useState<string>('');
  const [checklistReportsPDF, setChecklistReportsPDF] = useState<IReportPdf[]>([]);

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onPdfQuery, setOnPdfQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [counts, setCounts] = useState<ICounts>({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [filterData, setFilterData] = useState<IFilterData>({
    buildings: [],
    status: [],
    startDate: '',
    endDate: '',
  });

  const [reportView, setReportView] = useState<'reports' | 'pdfs'>('reports');

  const [modalChecklistDetails, setModalChecklistDetails] = useState(false);

  const [refresh, setRefresh] = useState(false);
  // #endregion

  const handleChecklistColors = (status?: string) => {
    switch (status) {
      case 'pending':
        return {
          name: 'Pendente',
          bgColor: '#D5D5D5',
          color: 'black',
        };
      case 'inProgress':
        return {
          name: 'Em andamento',
          bgColor: '#FFB200',
          color: 'white',
        };

      case 'completed':
        return {
          name: 'Concluído',
          bgColor: '#34B53A',
          color: 'white',
        };
      default:
        return {
          name: 'Pendente',
          bgColor: '#D5D5D5',
          color: 'black',
        };
    }
  };

  // #region util functions
  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleModals = (modal: string, modalState: boolean) => {
    switch (modal) {
      case 'modalChecklistDetails':
        setModalChecklistDetails(modalState);
        break;

      default:
        break;
    }
  };
  // #endregion

  // #region filter functions

  const handleFilterChange = (key: keyof IFilterData, value: string) => {
    setFilterData((prevState) => {
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
    setFilterData({
      buildings: [],
      status: [],
      startDate: '',
      endDate: '',
    });
  };
  // #endregion

  // #region csv
  // const csvHeaders = [
  //   { label: 'Edificação', key: 'Edificação' },
  //   { label: 'Status', key: 'Status' },
  //   { label: 'Nome do checklist', key: 'Nome do checklist' },
  //   { label: 'Descrição', key: 'Descrição' },
  //   { label: 'Responsável', key: 'Responsável' },
  //   { label: 'Periodicidade', key: 'Periodicidade' },
  //   { label: 'Data', key: 'Data' },
  //   { label: 'Observações', key: 'Observações' },
  //   { label: 'Imagens do relato', key: 'Imagens do relato' },
  // ];

  // const csvData = checklists?.map((data) => ({
  //   Edificação: data.building.name,
  //   Status: getSingularStatusNameforPdf(data.status),
  //   'Nome do checklist': data.name,
  //   Descrição: data.description,
  //   Responsável: data.syndic?.name || '-',
  //   Periodicidade: data.frequency ? 'Sim' : 'Não',
  //   Data: dateFormatter(data.date),
  //   Observações: data.observation || '',
  //   'Imagens do relato': data.images.map(({ url }) => url).join('; '),
  // }));
  // #endregion

  // #region functions
  const schemaReportFilter = yup
    .object({
      buildings: yup.array().of(yup.string()),
      status: yup.array().of(yup.string()),
      startDate: yup.date().required('A data inicial é obrigatória.'),
      endDate: yup
        .date()
        .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
        .required('A data final é obrigatória.'),
    })
    .required();

  const requestReportsData = async () => {
    setOnQuery(true);
    setChecklists([]);

    const params = {
      buildingId: filterData?.buildings?.length === 0 ? '' : filterData?.buildings?.join(','),
      status: filterData?.status?.length === 0 ? '' : filterData?.status?.join(','),
      startDate: filterData?.startDate,
      endDate: filterData?.endDate,
    };

    await Api.get(`/checklists/reports`, { params })
      .then((res) => {
        setChecklists(res.data.checklists);
        setCounts({
          pending: res.data.pendingCount,
          inProgress: res.data.inProgressCount,
          completed: res.data.completedCount,
        });
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  // #region pdf
  const handleGetChecklistPdf = async () => {
    setLoading(true);

    try {
      const responseData = await getChecklistReports();

      setChecklistReportsPDF(responseData.checklistPdfs);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTicketReportPDF = async () => {
    setOnPdfQuery(true);

    try {
      const filterNames: IChecklistFilterNames = {
        buildingsNames:
          filterData.buildings?.length === 0
            ? 'Todas'
            : filterData.buildings
                .map((building) => buildingsForSelect.find((b) => b.id === building)?.name)
                .join(', '),

        statusNames: filterData.status?.length === 0 ? 'Todos' : filterData.status.join(', '),
      };

      await generateChecklistReportPDF({ filterData, filterNames });

      handleGetChecklistPdf();
    } finally {
      setOnPdfQuery(false);
    }
  };

  // #endregion

  useEffect(() => {
    handleGetChecklistPdf();
  }, [refresh]);

  // #endregion

  return (
    <>
      {modalChecklistDetails && checklistId && (
        <ModalChecklistDetails
          checklistId={checklistId}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      <Style.Container>
        <h2>Relatórios de checklists</h2>

        <Style.FiltersContainer>
          <Formik
            initialValues={{
              buildings: [],
              status: [],
              startDate: '',
              endDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={() => requestReportsData()}
          >
            {({ errors, values, touched, setFieldValue }) => (
              <Form>
                <Style.FiltersGrid>
                  <FormikSelect
                    name="buildings"
                    label="Edificação"
                    selectPlaceholderValue={' '}
                    value=""
                    arrowColor="primary"
                    onChange={(e) => {
                      handleFilterChange('buildings', e.target.value);

                      if (e.target.value === 'all') {
                        setFilterData((prevState) => ({
                          ...prevState,
                          buildings: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filterData.buildings.length === 0}>
                      Todas
                    </option>

                    {buildingsForSelect?.map((building) => (
                      <option
                        key={building.id}
                        value={building.id}
                        disabled={filterData.buildings.some((e) => e === building.id)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </FormikSelect>

                  <FormikSelect
                    label="Status"
                    name="status"
                    selectPlaceholderValue={' '}
                    value=""
                    arrowColor="primary"
                    onChange={(e) => {
                      handleFilterChange('status', e.target.value);

                      if (e.target.value === 'all') {
                        setFilterData((prevState) => ({
                          ...prevState,
                          status: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filterData.status.length === 0}>
                      Todos
                    </option>

                    <option
                      value="completed"
                      disabled={filterData.status.some((e) => e === 'completed')}
                    >
                      Concluídas
                    </option>
                    <option
                      value="pending"
                      disabled={filterData.status.some((e) => e === 'pending')}
                    >
                      Pendentes
                    </option>
                  </FormikSelect>

                  <FormikInput
                    name="startDate"
                    label="Data inicial"
                    typeDatePlaceholderValue={values.startDate}
                    type="date"
                    value={values.startDate}
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                      handleFilterChange('startDate', e.target.value);
                    }}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    name="endDate"
                    label="Data final"
                    typeDatePlaceholderValue={values.endDate}
                    type="date"
                    value={values.endDate}
                    onChange={(e) => {
                      setFieldValue('endDate', e.target.value);
                      handleFilterChange('endDate', e.target.value);
                    }}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />
                </Style.FiltersGrid>

                <Style.FilterWrapperFooter>
                  <Style.FilterTags>
                    {filterData.buildings?.length === 0 ? (
                      <ListTag
                        label="Todas as edificações"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    ) : (
                      filterData.buildings?.map((building) => (
                        <ListTag
                          key={building}
                          label={buildingsForSelect.find((b) => b.id === building)?.name || ''}
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                          onClick={() => {
                            setFilterData((prevState) => ({
                              ...prevState,
                              buildings: prevState.buildings?.filter((b) => b !== building),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filterData.status?.length === 0 ? (
                      <ListTag
                        label="Todos os status"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    ) : (
                      filterData.status?.map((status) => (
                        <ListTag
                          key={status}
                          label={getPluralStatusNameforPdf(status)}
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                          onClick={() => {
                            setFilterData((prevState) => ({
                              ...prevState,
                              status: prevState.status?.filter((s) => s !== status),
                            }));
                          }}
                        />
                      ))
                    )}
                  </Style.FilterTags>
                </Style.FilterWrapperFooter>

                <Style.ButtonContainer>
                  <Style.ButtonWrapper>
                    {/* <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`Relatório de checklists ${new Date().toLocaleDateString(
                          'pt-BR',
                        )}`}
                        onClick={() => checklists.length !== 0}
                      >
                        <IconButton
                          label="Exportar"
                          icon={<IconCsvLogo strokeColor="primary" fillColor="" />}
                          onClick={() => {
                            //
                          }}
                          disabled={checklists.length === 0}
                        />
                      </CSVLink> */}

                    <IconButton
                      label="Exportar"
                      icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
                      onClick={() => handleGenerateTicketReportPDF()}
                      disabled={checklists?.length === 0 || onPdfQuery}
                    />

                    <Button
                      type="button"
                      label="Limpar filtros"
                      borderless
                      textColor="primary"
                      disable={loading}
                      onClick={() => handleClearFilter()}
                    />

                    <Button label="Filtrar" type="submit" disable={onQuery} bgColor="primary" />
                  </Style.ButtonWrapper>
                </Style.ButtonContainer>
              </Form>
            )}
          </Formik>
        </Style.FiltersContainer>

        <Style.ViewButtons>
          <Style.CustomButton
            type="button"
            active={reportView === 'reports'}
            onClick={() => {
              setReportView('reports');
            }}
          >
            Relatório
          </Style.CustomButton>

          <Style.CustomButton
            type="button"
            active={reportView === 'pdfs'}
            onClick={() => {
              setReportView('pdfs');
            }}
          >
            Histórico de relatórios
          </Style.CustomButton>
        </Style.ViewButtons>

        {onQuery && <DotSpinLoading />}

        {reportView === 'reports' && !onQuery && checklists?.length > 0 && (
          <>
            <Style.CountContainer>
              <Style.Counts>
                <Style.CountsInfo>
                  <h5 className="pending">{counts.pending}</h5>
                  <p className="p5">{counts.pending > 1 ? 'Pendentes' : 'Pendente'}</p>
                </Style.CountsInfo>

                <Style.CountsInfo>
                  <h5 className="inProgress">{counts.inProgress}</h5>
                  <p className="p5">Em andamento</p>
                </Style.CountsInfo>

                <Style.CountsInfo>
                  <h5 className="completed">{counts.completed}</h5>
                  <p className="p5">{counts.completed > 1 ? 'Concluídas' : 'Concluída'}</p>
                </Style.CountsInfo>
              </Style.Counts>
            </Style.CountContainer>
            <ReportDataTable
              colsHeader={[
                { label: 'Status' },
                { label: 'Edificação' },
                { label: 'Nome' },
                { label: 'Responsáveis' },
                { label: 'Items' },
                { label: 'Data' },
              ]}
            >
              {checklists?.map((checklist) => {
                const checklistTotalItems = checklist?.checklistItem?.length || 0;
                const checklistCompletedItems =
                  checklist?.checklistItem?.filter((item) => item.status !== 'pending').length || 0;

                return (
                  <ReportDataTableContent
                    key={checklist.id}
                    colsBody={[
                      {
                        cell: (
                          <EventTag
                            label={handleChecklistColors(checklist?.status).name}
                            color={handleChecklistColors(checklist?.status).color}
                            bgColor={handleChecklistColors(checklist?.status).bgColor}
                          />
                        ),
                        cssProps: { width: '81px' },
                      },
                      { cell: checklist?.building?.name },
                      { cell: checklist.name },

                      {
                        cell: checklist.checklistUsers?.map((user) => user.name).join(', ') || '-',
                      },
                      { cell: `${checklistCompletedItems} / ${checklistTotalItems}` },
                      { cell: dateFormatter(checklist?.date) },
                    ]}
                    onClick={() => {
                      setChecklistId(checklist?.id || '');
                      setModalChecklistDetails(true);
                    }}
                  />
                );
              })}
            </ReportDataTable>
          </>
        )}

        {reportView === 'reports' && !onQuery && checklists.length === 0 && (
          <Style.NoMaintenanceCard>
            <h4>Nenhum checklist encontrado.</h4>
          </Style.NoMaintenanceCard>
        )}

        {reportView === 'pdfs' && (
          <PdfList
            reportType="checklist"
            pdfList={checklistReportsPDF}
            loading={loading}
            handleRefreshPdf={handleGetChecklistPdf}
          />
        )}
      </Style.Container>
    </>
  );
};
