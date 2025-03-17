/* eslint-disable react/no-array-index-key */
// #region imports
// REACT
import { useState } from 'react';
import { CSVLink } from 'react-csv';

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
import { Select } from '@components/Inputs/Select';

// GLOBAL UTILS
import { catchHandler, dateFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconCsvLogo from '@assets/icons/IconCsvLogo';
import IconPdfLogo from '@assets/icons/IconPdfLogo';

// COMPONENTS
import { ReportDataTable, ReportDataTableContent } from '../Maintenances/ReportDataTable';
import { EventTag } from '../../Calendar/utils/EventTag';
import { ModalChecklistDetails } from '../../Checklists/ModalChecklistDetails';
import { ModalPrintChecklists } from './ModalPrintChecklists';

// UTILS
import {
  getSingularStatusNameforPdf,
  getPluralStatusNameforPdf,
} from '../Maintenances/ModalPrintReport/functions';

// STYLES
import * as s from './styles';

// TYPES
import type { IChecklists, IChecklistsForPDF, IFilter } from './types';

// #endregion

export const ChecklistReports = () => {
  // #region states
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [checklists, setChecklists] = useState<IChecklists[]>([]);
  const [checklistsForPDF, setChecklistsForPDF] = useState<IChecklistsForPDF[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);
  const [modalChecklistDetailsOpen, setModalChecklistDetailsOpen] = useState(false);
  const [checklistId, setChecklistId] = useState<string>('');

  const [filterforRequest, setFilterforRequest] = useState<IFilter>({
    startDate: '',
    endDate: '',
    buildingNames: [],
    statusNames: [],
  });

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);
  const [buildingsForFilter, setBuildingsForFilter] = useState<string[]>([]);
  const [statusForFilter, setStatusForFilter] = useState<string[]>([]);

  // #endregion

  // #region csv
  const csvHeaders = [
    { label: 'Edificação', key: 'Edificação' },
    { label: 'Status', key: 'Status' },
    { label: 'Nome do checklist', key: 'Nome do checklist' },
    { label: 'Descrição', key: 'Descrição' },
    { label: 'Responsável', key: 'Responsável' },
    { label: 'Periodicidade', key: 'Periodicidade' },
    { label: 'Data', key: 'Data' },
    { label: 'Observações', key: 'Observações' },
    { label: 'Imagens do relato', key: 'Imagens do relato' },
  ];

  const csvData = checklists.map((data) => ({
    Edificação: data.building.name,
    Status: getSingularStatusNameforPdf(data.status),
    'Nome do checklist': data.name,
    Descrição: data.description,
    Responsável: data.syndic?.name || '-',
    Periodicidade: data.frequency ? 'Sim' : 'Não',
    Data: dateFormatter(data.date),
    Observações: data.observation || '',
    'Imagens do relato': data.images.map(({ url }) => url).join('; '),
  }));
  // #endregion

  // #region functions
  const schemaReportFilter = yup
    .object({
      buildingNames: yup.array().of(yup.string()),
      status: yup.array().of(yup.string()),
      startDate: yup.date().required('A data inicial é obrigatória.'),
      endDate: yup
        .date()
        .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
        .required('A data final é obrigatória.'),
    })
    .required();

  const requestReportsData = async (filters: IFilter) => {
    setOnQuery(true);
    setChecklists([]);

    await Api.get(`/checklists/reports?filters=${JSON.stringify(filters)}`)
      .then((res) => {
        setChecklists(res.data.checklists);
        setChecklistsForPDF(res.data.checklistsForPDF);
        setPendingCount(res.data.pendingCount);
        setCompletedCount(res.data.completedCount);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  // #endregion

  return (
    <>
      {modalPrintReportOpen && (
        <ModalPrintChecklists
          setModal={setModalPrintReportOpen}
          checklistsForPDF={checklistsForPDF}
          filterforPDF={filterforRequest}
          completedCount={completedCount}
          pendingCount={pendingCount}
        />
      )}

      {modalChecklistDetailsOpen && (
        <ModalChecklistDetails
          checklistId={checklistId}
          setModal={setModalChecklistDetailsOpen}
          onThenRequest={async () => {
            requestReportsData(filterforRequest);
          }}
        />
      )}

      <s.Container>
        <h2>Relatórios de checklists</h2>
        <s.FiltersContainer>
          <Formik
            initialValues={{
              buildingNames: [],
              statusNames: [],
              startDate: '',
              endDate: '',
            }}
            validationSchema={schemaReportFilter}
            onSubmit={async (values) => {
              setShowNoDataMessage(true);

              setFilterforRequest({
                endDate: values.endDate,
                startDate: values.startDate,
                buildingNames: buildingsForFilter,
                statusNames: statusForFilter,
              });

              await requestReportsData({
                ...values,
                buildingNames: buildingsForFilter,
                statusNames: statusForFilter,
              });
            }}
          >
            {({ errors, values, touched }) => (
              <Form>
                <s.FiltersGrid>
                  <Select
                    selectPlaceholderValue={buildingsForFilter.length > 0 ? ' ' : ''}
                    label="Edificação"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      setBuildingsForFilter((prevState) => [...prevState, e.target.value]);

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

                    {buildingsForSelect?.map((building) => (
                      <option
                        key={building.name}
                        value={building.name}
                        disabled={buildingsForFilter.some((e) => e === building.name)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={statusForFilter.length > 0 ? ' ' : ''}
                    label="Status"
                    value=""
                    arrowColor="primary"
                    onChange={(e) => {
                      setStatusForFilter((prevState) => [...prevState, e.target.value]);

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
                    <option
                      value="completed"
                      disabled={statusForFilter.some((e) => e === 'completed')}
                    >
                      Concluídas
                    </option>
                    <option value="pending" disabled={statusForFilter.some((e) => e === 'pending')}>
                      Pendentes
                    </option>
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
                        <p className="p3">Todas as edificações </p>
                      </s.Tag>
                    )}

                    {buildingsForFilter.map((building, i: number) => (
                      <s.Tag key={building}>
                        <p className="p3">{building}</p>
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
                      <s.Tag key={status}>
                        <p className="p3">{getPluralStatusNameforPdf(status)}</p>
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
                        icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
                        label="Exportar"
                        onClick={() => {
                          setModalPrintReportOpen(true);
                        }}
                        disabled={checklists.length === 0}
                      />
                      <Button label="Filtrar" type="submit" disable={onQuery} bgColor="primary" />
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
            <h4>Nenhuma checklist encontrada.</h4>
          </s.NoMaintenanceCard>
        )}

        {!onQuery && checklists.length > 0 && (
          <>
            <s.CountContainer>
              <s.Counts>
                <s.CountsInfo>
                  <h5 className="completed">{completedCount}</h5>
                  <p className="p5">{completedCount > 1 ? 'Concluídas' : 'Concluída'}</p>
                </s.CountsInfo>

                <s.CountsInfo>
                  <h5 className="pending">{pendingCount}</h5>
                  <p className="p5">{pendingCount > 1 ? 'Pendentes' : 'Pendente'}</p>
                </s.CountsInfo>
              </s.Counts>
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
                    {
                      cell: <EventTag status={checklist.status} />,
                      cssProps: { width: '81px' },
                    },
                    { cell: checklist.building.name },
                    { cell: checklist.name },
                    { cell: checklist.description },
                    { cell: checklist.syndic?.name || '-' },
                    { cell: checklist.frequency ? 'Sim' : 'Não' },
                    { cell: dateFormatter(checklist.date) },
                  ]}
                  onClick={() => {
                    setChecklistId(checklist.id);
                    setModalChecklistDetailsOpen(true);
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
