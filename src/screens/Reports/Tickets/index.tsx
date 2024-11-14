// REACT
import { useEffect, useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { CSVLink } from 'react-csv';
import * as yup from 'yup';

// API
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { FormikInput } from '@components/Form/FormikInput';
import { Select } from '@components/Inputs/Select';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { catchHandler, dateFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// COMPONENTS
import { ReportDataTable, ReportDataTableContent } from '../Maintenances/ReportDataTable';
import { ModalPrintTickets } from './ModalPrintTickets';
import ModalTicketDetails from '../../Tickets/ModalTicketDetails';

// STYLES
import * as s from './styles';

// TYPES
import type { ITicket, ITicketsForPDF, IFilter } from './types';

// #endregion

export const TicketReports = () => {
  // #region states
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [ticketsForPDF, setTicketsForPDF] = useState<ITicketsForPDF[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [awaitingToFinishCount, setAwaitingToFinishCount] = useState(0);
  const [filtersOptions, setFiltersOptions] = useState<{ buildings: { name: string }[] }>();

  const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);
  const [ticketDetailsModal, setTicketDetailsModal] = useState<boolean>(false);

  const [ticketId, setTicketId] = useState<string>('');

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

  const getPluralStatusName = (status: string) => {
    let statusName = '';

    switch (status) {
      case 'open':
        statusName = 'Abertos';
        break;

      case 'finished':
        statusName = 'Finalizados';
        break;

      case 'awaitingToFinish':
        statusName = 'Aguardando finalizações';
        break;

      default:
        break;
    }

    return statusName;
  };

  const getSingularStatusName = (status: string) => {
    let statusName = '';

    switch (status) {
      case 'open':
        statusName = 'Aberto';
        break;

      case 'finished':
        statusName = 'Finalizado';
        break;

      case 'awaitingToFinish':
        statusName = 'Aguardando finalização';
        break;

      default:
        break;
    }

    return statusName;
  };

  const handleTicketDetailsModal = (modalState: boolean) => {
    setTicketDetailsModal(modalState);
  };
  // #region csv
  const csvHeaders = [
    { label: 'Status', key: 'Status' },
    { label: 'Edificação', key: 'Edificação' },
    { label: 'Local da ocorrência', key: 'Local da ocorrência' },
    { label: 'Tipo da manutenção', key: 'Tipo da manutenção' },
    { label: 'Descrição', key: 'Descrição' },
    { label: 'Morador', key: 'Morador' },
    { label: 'Data', key: 'Data' },
    { label: 'Imagens', key: 'Imagens' },
  ];

  const csvData = tickets.map((data) => ({
    Status: getSingularStatusName(data.status.name),
    Edificação: data.building.name,
    'Local da ocorrência': data.place.label,
    'Tipo da manutenção': data.types.map((e) => e.type.label).join(', '),
    Descrição: data.description,
    Morador: data.residentName,
    Data: dateFormatter(data.createdAt),
    Imagens: data.images.map(({ url }) => url).join('; '),
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
    setTickets([]);

    await Api.get(`/tickets/reports?filters=${JSON.stringify(filters)}`)
      .then((res) => {
        setTickets(res.data.tickets);
        setTicketsForPDF(res.data.ticketsForPDF);
        setOpenCount(res.data.openCount);
        setFinishedCount(res.data.finishedCount);
        setAwaitingToFinishCount(res.data.awaitingToFinishCount);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const requestBuildings = async () => {
    await Api.get(`/buildings/reports/listforselect`)
      .then((res) => {
        setFiltersOptions(res.data.filters);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  // #endregion

  useEffect(() => {
    requestBuildings();
  }, []);

  return (
    <>
      {modalPrintReportOpen && ticketsForPDF.length > 0 && (
        <ModalPrintTickets
          setModal={setModalPrintReportOpen}
          ticketsForPDF={ticketsForPDF}
          filterforPDF={filterforRequest}
          openCount={openCount}
          finishedCount={finishedCount}
          awaitingToFinishCount={awaitingToFinishCount}
        />
      )}

      {ticketDetailsModal && (
        <ModalTicketDetails
          ticketId={ticketId}
          showButtons={false}
          handleTicketDetailsModal={handleTicketDetailsModal}
        />
      )}

      <s.Container>
        <h2>Relatórios de chamados</h2>

        <s.FiltersContainer>
          <h5>Filtros</h5>
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

                    {filtersOptions?.buildings.map((building) => (
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
                    <option value="open" disabled={statusForFilter.some((e) => e === 'open')}>
                      Abertos
                    </option>
                    <option
                      value="awaitingToFinish"
                      disabled={statusForFilter.some((e) => e === 'awaitingToFinish')}
                    >
                      Aguardando finalizações
                    </option>
                    <option
                      value="finished"
                      disabled={statusForFilter.some((e) => e === 'finished')}
                    >
                      Finalizados
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
                        <p className="p3">Todas as edificações</p>
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
                        <p className="p3">{getPluralStatusName(status)}</p>
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
                        filename={`Relatório de chamados ${new Date().toLocaleDateString('pt-BR')}`}
                        onClick={() => tickets.length !== 0}
                      >
                        <IconButton
                          icon={icon.csvLogo}
                          label="Exportar"
                          color={theme.color.primary}
                          size="20px"
                          onClick={() => {
                            //
                          }}
                          disabled={tickets.length === 0}
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
                        disabled={tickets.length === 0}
                      />
                      <Button label="Filtrar" type="submit" disable={onQuery} />
                    </s.ButtonWrapper>
                  </s.ButtonContainer>
                </s.FiltersGrid>
              </Form>
            )}
          </Formik>
        </s.FiltersContainer>

        {onQuery && <DotSpinLoading />}

        {!onQuery && tickets.length === 0 && showNoDataMessage && (
          <s.NoMaintenanceCard>
            <h4>Nenhum chamado encontrado.</h4>
          </s.NoMaintenanceCard>
        )}

        {!onQuery && tickets.length > 0 && (
          <>
            <s.CountContainer>
              <s.Counts>
                <s.CountsInfo>
                  <h5 className="finished">{finishedCount}</h5>
                  <p className="p5">{finishedCount > 1 ? 'Finalizados' : 'Finalizado'}</p>
                </s.CountsInfo>

                <s.CountsInfo>
                  <h5 className="open">{openCount}</h5>
                  <p className="p5">{openCount > 1 ? 'Abertos' : 'Aberto'}</p>
                </s.CountsInfo>

                <s.CountsInfo>
                  <h5 className="awaitingToFinish">{awaitingToFinishCount}</h5>
                  <p className="p5">
                    {awaitingToFinishCount > 1
                      ? 'Aguardando finalizações'
                      : 'Aguardando finalização'}
                  </p>
                </s.CountsInfo>
              </s.Counts>
            </s.CountContainer>
            <ReportDataTable
              colsHeader={[
                { label: 'Status' },
                { label: 'Edificação' },
                { label: 'Local da ocorrência' },
                { label: 'Tipo da manutenção' },
                { label: 'Descrição' },
                { label: 'Morador' },
                { label: 'Data' },
              ]}
            >
              {tickets?.map((ticket) => (
                <ReportDataTableContent
                  key={ticket.id}
                  colsBody={[
                    {
                      cell: (
                        <ListTag
                          label={ticket.status.label}
                          backgroundColor={ticket.status.backgroundColor}
                          color={ticket.status.color}
                          padding={`2px ${theme.size.xxsm}`}
                          fontSize="10px"
                          lineHeight="12px"
                          fontWeight={500}
                        />
                      ),
                      cssProps: { width: '81px' },
                    },
                    { cell: ticket.building.name },
                    { cell: ticket.place.label },
                    { cell: ticket.types.map((e) => e.type.singularLabel).join(', ') },
                    { cell: ticket.description },
                    { cell: ticket.residentName },
                    { cell: dateFormatter(ticket.createdAt) },
                  ]}
                  onClick={() => {
                    setTicketId(ticket.id);
                    handleTicketDetailsModal(true);
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
