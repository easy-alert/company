// REACT
import { useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { CSVLink } from 'react-csv';
import * as yup from 'yup';

// API
import { Api } from '@services/api';
import { getTicketsByBuildingNanoId } from '@services/apis/getTicketsByBuildingNanoId';
import { generateTicketReportPDF } from '@services/apis/generateTicketReportPDF';

// HOOKS
import { useServiceTypes } from '@hooks/useServiceTypes';
import { useTicketPlaces } from '@hooks/useTicketPlaces';
import { useTicketStatus } from '@hooks/useTicketStatus';
import { useBuildings } from '@hooks/useBuildings';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { FormikInput } from '@components/Form/FormikInput';
import { Select } from '@components/Inputs/Select';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { catchHandler } from '@utils/functions';
import { handleToastify } from '@utils/toastifyResponses';
import { formatDateString } from '@utils/dateFunctions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';

// COMPONENTS
import { ReportDataTable, ReportDataTableContent } from '../Maintenances/ReportDataTable';
import { ModalPrintTickets } from './ModalPrintTickets';
import ModalTicketDetails from '../../Tickets/ModalTicketDetails';

// STYLES
import * as Style from './styles';

// TYPES
import type { ITicketsForPDF, IFilter } from './types';

// #endregion

export interface ITicketFilter {
  buildings: string[];
  status: string[];
  places: string[];
  serviceTypes: string[];
  startDate?: string;
  endDate?: string;
  seen: string;
}

export const TicketReports = () => {
  const { serviceTypes } = useServiceTypes({ buildingNanoId: 'all', page: 1, take: 10 });
  const { ticketPlaces } = useTicketPlaces({ placeId: 'all' });
  const { ticketStatus } = useTicketStatus({ statusName: 'all' });
  const { buildings } = useBuildings({ filter: '', page: 1 });

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [ticketsForPDF, setTicketsForPDF] = useState<ITicketsForPDF[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [awaitingToFinishCount, setAwaitingToFinishCount] = useState(0);
  const [dismissedCount, setDismissedCount] = useState(0);

  const [modalPrintReportOpen, setModalPrintReportOpen] = useState<boolean>(false);
  const [ticketDetailsModal, setTicketDetailsModal] = useState<boolean>(false);

  const [ticketId, setTicketId] = useState<string>('');

  const [filterforRequest, setFilterforRequest] = useState<IFilter>({
    startDate: '',
    endDate: '',
    buildingNames: [],
    statusNames: [],
  });

  const [filter, setFilter] = useState<ITicketFilter>({
    buildings: [],
    status: [],
    places: [],
    serviceTypes: [],
    startDate: '',
    endDate: '',
    seen: '',
  });

  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // #endregion
  const handleClearFilter = () => {
    setFilter({
      buildings: [],
      status: [],
      places: [],
      serviceTypes: [],
      startDate: '',
      endDate: '',
      seen: '',
    });
  };

  const handleFilterChange = (key: keyof ITicketFilter, value: string) => {
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

  const getSingularStatusName = (status?: string) => {
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

  const csvData = tickets.map((ticket) => ({
    Status: getSingularStatusName(ticket.status?.label),
    Edificação: ticket.building?.name,
    'Local da ocorrência': ticket.place?.label,
    'Tipo da manutenção': ticket.types?.map((e) => e.type.label).join(', '),
    Descrição: ticket.description,
    Morador: ticket.residentName,
    Data: formatDateString(ticket.createdAt, 'dd/MM/yyyy'),
    Imagens: ticket.images?.map(({ url }) => url).join('; '),
  }));
  // #endregion

  // #region functions
  const handleCountTickets = (countTickets: ITicket[]) => {
    const open = countTickets.filter((ticket) => ticket.status?.name === 'open');
    const awaitingToFinish = countTickets.filter(
      (ticket) => ticket.status?.name === 'awaitingToFinish',
    );
    const finished = countTickets.filter((ticket) => ticket.status?.name === 'finished');
    const dismissed = countTickets.filter((ticket) => ticket.status?.name === 'dismissed');

    setOpenCount(open.length);
    setAwaitingToFinishCount(awaitingToFinish.length);
    setFinishedCount(finished.length);
    setDismissedCount(dismissed.length);
  };

  const requestReportsData = async (filters: IFilter) => {
    setLoading(true);
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
        setLoading(false);
      });
  };

  const handleGetTickets = async () => {
    try {
      setLoading(true);

      const response = await getTicketsByBuildingNanoId({
        filter,
      });

      setTickets(response.tickets);

      handleCountTickets(response.tickets);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // #endregion

  const handleGenerateTicketReportPDF = async () => {
    try {
      const response = await generateTicketReportPDF({ filter });
      console.log('🚀 ~ handleGenerateTicketReportPDF ~ response:', response);
    } catch (error: any) {
      console.log('🚀 ~ handleGenerateTicketReportPDF ~ error:', error);
      handleToastify(error.response);
    }
  };

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

      <Style.Container>
        <h2>Relatórios de chamados</h2>

        <Style.FiltersContainer>
          <Formik
            initialValues={{
              buildings: [],
              status: [],
              places: [],
              serviceTypes: [],
              startDate: '',
              endDate: '',
              seen: '',
            }}
            onSubmit={async () => handleGetTickets()}
          >
            {({ errors, values, setFieldValue, touched }) => (
              <Form>
                <Style.FilterWrapper>
                  <Select
                    selectPlaceholderValue={filter.buildings.length > 0 ? ' ' : ''}
                    label="Edificação"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('buildings', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({ ...prevState, buildings: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.buildings.length === 0}>
                      Todas
                    </option>

                    {buildings.map((building) => (
                      <option
                        value={building.nanoId}
                        key={building.nanoId}
                        disabled={filter.buildings.some((b) => b === building.nanoId)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.places.length > 0 ? ' ' : ''}
                    label="Local"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('places', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({ ...prevState, places: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.places.length === 0}>
                      Todos
                    </option>

                    {ticketPlaces.map((place) => (
                      <option
                        value={place.id}
                        key={place.id}
                        disabled={filter.places.some((p) => p === place.id)}
                      >
                        {place.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.serviceTypes.length > 0 ? ' ' : ''}
                    label="Tipo de serviço"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('serviceTypes', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({ ...prevState, serviceTypes: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.serviceTypes.length === 0}>
                      Todos
                    </option>

                    {serviceTypes.map((type) => (
                      <option
                        value={type.id}
                        key={type.id}
                        disabled={filter.serviceTypes.some(
                          (serviceType) => serviceType === type.id,
                        )}
                      >
                        {type.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.status.length > 0 ? ' ' : ''}
                    label="Status"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('status', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({ ...prevState, status: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.status.length === 0}>
                      Todos
                    </option>

                    {ticketStatus.map((status) => (
                      <option
                        value={status.name}
                        key={status.name}
                        disabled={filter.status.some((s) => s === status.name)}
                      >
                        {status.label}
                      </option>
                    ))}
                  </Select>

                  <FormikInput
                    label="Data inicial"
                    typeDatePlaceholderValue={values.startDate}
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                      handleFilterChange('startDate', e.target.value);
                    }}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    label="Data final"
                    typeDatePlaceholderValue={values.endDate}
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={(e) => {
                      setFieldValue('endDate', e.target.value);
                      handleFilterChange('endDate', e.target.value);
                    }}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />
                </Style.FilterWrapper>

                <Style.FilterWrapperFooter>
                  <Style.FilterButtonWrapper>
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
                        disabled={loading || tickets.length === 0}
                      />
                    </CSVLink>

                    <IconButton
                      icon={icon.pdfLogo}
                      label="Exportar"
                      color={theme.color.primary}
                      size="20px"
                      onClick={() => handleGenerateTicketReportPDF()}
                      disabled={loading || tickets.length === 0}
                    />

                    <Button
                      type="button"
                      borderless
                      label="Limpar filtros"
                      textColor={theme.color.primary}
                      onClick={() => {
                        setFieldValue('startDate', '');
                        setFieldValue('endDate', '');
                        handleClearFilter();
                      }}
                    />

                    <Button type="submit" label="Filtrar" disabled={loading} />
                  </Style.FilterButtonWrapper>

                  <Style.FilterTags>
                    {filter.buildings?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todas as edificações" />
                    ) : (
                      filter.buildings?.map((building) => (
                        <ListTag
                          key={building}
                          label={buildings.find((b) => b.nanoId === building)?.name || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              buildings: prevState.buildings?.filter((b) => b !== building),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.status?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todos os status" />
                    ) : (
                      filter.status?.map((status) => (
                        <ListTag
                          key={status}
                          label={ticketStatus.find((ts) => ts.name === status)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              status: prevState.status?.filter((ts) => ts !== status),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.places?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todos os locais" />
                    ) : (
                      filter.places?.map((place) => (
                        <ListTag
                          key={place}
                          label={ticketPlaces.find((p) => p.id === place)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              places: prevState.places?.filter((p) => p !== place),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.serviceTypes?.length === 0 ? (
                      <ListTag
                        padding="4px 12px"
                        fontWeight={500}
                        label="Todos os tipos de serviço"
                      />
                    ) : (
                      filter.serviceTypes?.map((serviceType) => (
                        <ListTag
                          key={serviceType}
                          label={serviceTypes.find((st) => st.id === serviceType)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              serviceTypes: prevState.serviceTypes?.filter(
                                (st) => st !== serviceType,
                              ),
                            }));
                          }}
                        />
                      ))
                    )}
                  </Style.FilterTags>
                </Style.FilterWrapperFooter>
              </Form>
            )}
          </Formik>
        </Style.FiltersContainer>

        {loading && <DotSpinLoading />}

        {!loading && tickets.length === 0 && showNoDataMessage && (
          <Style.NoMaintenanceCard>
            <h4>Nenhum chamado encontrado.</h4>
          </Style.NoMaintenanceCard>
        )}

        {!loading && tickets.length > 0 && (
          <>
            <Style.CountContainer>
              <Style.Counts>
                <Style.CountsInfo color="black">
                  <h5 className="open">{openCount}</h5>
                  <p className="p5">{openCount > 1 ? 'Abertos' : 'Aberto'}</p>
                </Style.CountsInfo>

                <Style.CountsInfo
                  color={ticketStatus.find((ts) => ts.name === 'awaitingToFinish')?.backgroundColor}
                >
                  <h5 className="awaitingToFinish">{awaitingToFinishCount}</h5>
                  <p className="p5">
                    {awaitingToFinishCount > 1
                      ? 'Aguardando finalizações'
                      : 'Aguardando finalização'}
                  </p>
                </Style.CountsInfo>

                <Style.CountsInfo
                  color={ticketStatus.find((ts) => ts.name === 'finished')?.backgroundColor}
                >
                  <h5 className="finished">{finishedCount}</h5>
                  <p className="p5">{finishedCount > 1 ? 'Finalizados' : 'Finalizado'}</p>
                </Style.CountsInfo>

                <Style.CountsInfo
                  color={ticketStatus.find((ts) => ts.name === 'dismissed')?.backgroundColor}
                >
                  <h5 className="dismissed">{dismissedCount}</h5>
                  <p className="p5">{dismissedCount > 1 ? 'Indeferidos' : 'Indeferido'}</p>
                </Style.CountsInfo>
              </Style.Counts>
            </Style.CountContainer>

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
                          label={ticket.status?.label || ''}
                          backgroundColor={ticket.status?.backgroundColor}
                          color={ticket.status?.color}
                          padding={`2px ${theme.size.xxsm}`}
                          fontSize="10px"
                          lineHeight="12px"
                          fontWeight={500}
                        />
                      ),
                      cssProps: { width: '81px' },
                    },
                    { cell: ticket.building?.name },
                    { cell: ticket.place?.label },
                    { cell: ticket.types?.map((e) => e.type.singularLabel).join(', ') },
                    { cell: ticket.description },
                    { cell: ticket.residentName },
                    { cell: formatDateString(ticket.createdAt, 'dd/MM/yyyy') },
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
      </Style.Container>
    </>
  );
};
