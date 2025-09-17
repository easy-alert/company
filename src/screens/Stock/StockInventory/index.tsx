// REACT
import { useCallback, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

// HOOKS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';
import { useStockItemTypesForSelect } from '@hooks/useStockItemTypesForSelect';

// SERVICES
import { getStock } from '@services/apis/getStock';
import { postStock } from '@services/apis/postStock';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikInput } from '@components/Form/FormikInput';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Table, TableContent } from '@components/Table';
import TableCell from '@components/TableCell';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import IconFilter from '@assets/icons/IconFilter';

// GLOBAL UTILS
import { handleTranslate } from '@utils/handleTranslate';
import { dateTimeFormatter } from '@utils/functions';

// GLOBAL TYPES
import type { IStock, IStockForm } from '@customTypes/IStock';
import type { IColsBody, IColsHeader } from '@components/Table/types';

// COMPONENTS
import { ModalCreateStock } from './components/ModalCreateStock';
import { ModalStockDetails } from './components/ModalStockDetails';

// STYLES
import * as Style from './styles';

export interface IStockFilter {
  buildingIds?: string[];
  stockItemTypesIds?: string[];
  status?: string[];
  search?: string;
}

export const StockInventory = () => {
  const {
    account: {
      User: { id: userId },
    },
  } = useAuthContext();
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: false });
  const { stockItemTypesForSelect } = useStockItemTypesForSelect({ buildingId: '' });

  const [stocks, setStocks] = useState<IStock[]>([]);
  const [stocksCount, setStocksCount] = useState(0);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const [filter, setFilter] = useState<IStockFilter>({
    buildingIds: [],
    stockItemTypesIds: [],
    status: [],
    search: '',
  });

  const [modalCreateStock, setModalCreateStock] = useState(false);
  const [modalEditStock, setModalEditStock] = useState(false);
  const [modalStockDetails, setModalStockDetails] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  // region handlers
  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleModalCreateStock = (modalState: boolean) => {
    setModalCreateStock(modalState);
  };

  const handleModalEditStock = (modalState: boolean) => {
    setModalEditStock(modalState);
  };

  const handleModalStockDetails = (modalState: boolean, stock?: IStock) => {
    if (!stock) {
      setSelectedStock(null);
      setModalStockDetails(modalState);
      return;
    }

    setSelectedStock(stock.id);
    setModalStockDetails(modalState);
  };

  // endregion

  // region filters
  const handleFilterChange = (key: keyof IStockFilter, value: string) => {
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
      buildingIds: [],
      stockItemTypesIds: [],
      status: [],
      search: '',
    });
  };
  // endregion

  // region api
  const handleGetStock = async () => {
    setLoading(true);

    try {
      const responseData = await getStock({
        buildingIds: filter.buildingIds || [],
        stockItemTypesIds: filter.stockItemTypesIds || [],
        status: filter.status || [],
        search: filter.search || '',
      });

      if (responseData) {
        setStocks(responseData?.stocks || []);
        setStocksCount(responseData?.stocksCount || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStock = async (values: IStockForm) => {
    setLoading(true);

    try {
      const responseData = await postStock({
        buildingId: values.buildingId,
        quantity: values.quantity,
        minimumQuantity: values.minimumQuantity,
        location: values.location,
        notes: values.notes,
        stockItemId: values.stockItemId,
        isActive: values.isActive,
      });

      if (responseData) {
        setStocks([...stocks, responseData.stock]);
        setStocksCount(stocksCount + 1);
        handleModalCreateStock(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // endregion

  // region table
  const renderStatusCell = useCallback((item: IStock) => {
    const isNonCompliant = (item.quantity || 0) < (item.minimumQuantity || 0);

    return (
      <span
        style={{
          color: isNonCompliant ? 'red' : 'green',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {isNonCompliant ? 'NÃO CONFORME' : 'CONFORME'}
      </span>
    );
  }, []);

  const renderLastMovement = useCallback((item: IStock) => {
    if (!item.movements?.length) return '-';

    const lastMovement = item.movements[0];

    const { movementDate, movementType, lastUpdatedBy, transferTo } = lastMovement;

    const lastMovementDate = dateTimeFormatter(movementDate || '').split(',');

    let lastMovementType = '';
    let lastMovementBy = '';

    if (movementType === 'TRANSFER_IN' || movementType === 'TRANSFER_OUT') {
      lastMovementType = `${handleTranslate({
        key: movementType || '',
        capitalize: true,
      })} para ${transferTo?.name}`;

      lastMovementBy = lastUpdatedBy ? `por ${lastUpdatedBy?.name}` : '';
    } else {
      lastMovementType = handleTranslate({
        key: movementType || '',
        capitalize: true,
      });
      lastMovementBy = lastUpdatedBy ? `por ${lastUpdatedBy?.name}` : '';
    }

    const lastMovementText = `${lastMovementType} - ${lastMovementDate[0]} às ${lastMovementDate[1]} ${lastMovementBy}`;

    return <TableCell value={lastMovementText} type="string" />;
  }, []);

  // const renderActions = useCallback((item: IStock) => {
  //   const handleDeleteStock = async (id: string) => {
  //     setLoading(true);

  //     try {
  //       const responseData = await deleteStock({ id });

  //       if (responseData?.stock?.id) {
  //         setStocks(stocks.filter((stock) => stock.id !== responseData.stock.id));
  //         setStocksCount(stocksCount - 1);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   return (
  //     <Style.ActionsContainer>
  //       <IconButton
  //         label=""
  //         icon={<IconEdit strokeColor="primary" />}
  //         onClick={() => {
  //           setSelectedStock(item.id);
  //           handleModalEditStock(true);
  //         }}
  //       />

  //       <PopoverButton
  //         type="IconButton"
  //         buttonIcon={<IconTrash strokeColor="primary" />}
  //         label="Excluir"
  //         message={{
  //           title: 'Deseja excluir este item?',
  //           content: 'Atenção, essa ação é irreversível.',
  //         }}
  //         fontWeight="400"
  //         actionButtonClick={() => handleDeleteStock(item.id)}
  //       />
  //     </Style.ActionsContainer>
  //   );
  // }, []);

  const colsHeader: IColsHeader[] = [
    { label: 'Ativo' },
    { label: 'Tipo' },
    { label: 'Edificação' },
    { label: 'Última movimentação' },
    { label: 'Status', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Quantidade', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Quantidade necessária', cssProps: { width: '1%', textAlign: 'center' } },
    // { label: 'Ações', cssProps: { width: '1%', textAlign: 'center' } },
  ];

  const colsBody: IColsBody<IStock>[] = [
    {
      cell: (item: IStock) => item.stockItem?.name || '',
      cssProps: {
        textAlign: 'left',
      },
    },
    {
      cell: (item: IStock) => item.stockItem?.stockItemType?.name || '',
      cssProps: {
        textAlign: 'left',
      },
    },
    {
      cell: (item: IStock) => item.building?.name || '',
      cssProps: {
        textAlign: 'left',
      },
    },
    { cell: renderLastMovement, node: true },
    {
      cell: renderStatusCell,
      node: true,
      cssProps: {
        textAlign: 'center',
      },
    },

    {
      cell: (item: IStock) => item.quantity || 0,
      cssProps: {
        textAlign: 'center',
      },
    },
    {
      cell: (item: IStock) => item.minimumQuantity || 0,
      cssProps: {
        textAlign: 'center',
      },
    },
    // {
    //   cell: renderActions,
    //   node: true,
    //   cssProps: {
    //     textAlign: 'center',
    //   },
    // },
  ];
  // endregion

  useEffect(() => {
    handleGetStock();
  }, [refresh]);

  return (
    <>
      {modalCreateStock && (
        <ModalCreateStock
          loading={loading}
          onSubmit={handleCreateStock}
          onClose={() => handleModalCreateStock(false)}
        />
      )}

      {modalStockDetails && selectedStock && (
        <ModalStockDetails
          stockId={selectedStock}
          userId={userId}
          onClose={() => handleModalStockDetails(false)}
          onRefresh={handleRefresh}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <h2>Estoque</h2>

            <IconButton
              labelPos="right"
              label="Filtros"
              icon={<IconFilter strokeColor="primary" fillColor="" />}
              hideLabelOnMedia
              disabled={loading}
              onClick={() => setShowFilter((prevState) => !prevState)}
            />
          </Style.HeaderWrapper>

          <Style.IconsContainer>
            <IconButton
              label="Cadastrar"
              icon={<IconPlus strokeColor="primary" />}
              onClick={() => handleModalCreateStock(true)}
            />
          </Style.IconsContainer>
        </Style.Header>

        {showFilter && (
          <Style.FiltersContainer>
            <Formik
              initialValues={{
                buildingIds: [],
                itemTypesIds: [],
                status: [],
                search: '',
              }}
              onSubmit={() => handleGetStock()}
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
                        handleFilterChange('buildingIds', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            buildingIds: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.buildingIds?.length === 0}>
                        Todas
                      </option>

                      {buildingsForSelect?.map((building) => (
                        <option
                          value={building.id}
                          key={building.id}
                          disabled={filter.buildingIds?.some((b) => b === building.id)}
                        >
                          {building.name}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikSelect
                      id="item-type-select"
                      label="Tipo de item"
                      selectPlaceholderValue={' '}
                      value=""
                      disabled={loading}
                      onChange={(e) => {
                        handleFilterChange('stockItemTypesIds', e.target.value);

                        if (e.target.value === 'all') {
                          setFilter((prevState) => ({
                            ...prevState,
                            stockItemTypesIds: [],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      <option value="all" disabled={filter.stockItemTypesIds?.length === 0}>
                        Todas
                      </option>

                      {stockItemTypesForSelect?.map((stockItemType) => (
                        <option
                          key={stockItemType.id}
                          value={stockItemType.id}
                          disabled={filter.stockItemTypesIds?.includes(stockItemType.id)}
                        >
                          {stockItemType.name}
                        </option>
                      ))}
                    </FormikSelect>

                    {/* <FormikSelect
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
                  </FormikSelect> */}

                    <FormikInput
                      name="search"
                      label="Buscar"
                      placeholder="Procurar por algum termo"
                      value={filter.search}
                      disabled={loading}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </Style.FilterWrapper>

                  <Style.FilterWrapperFooter>
                    <Style.FilterTags>
                      {filter.buildingIds?.length === 0 ? (
                        <ListTag
                          label="Todas as edificações"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.buildingIds?.map((buildingId) => (
                          <ListTag
                            key={buildingId}
                            label={buildingsForSelect.find((b) => b.id === buildingId)?.name || ''}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                buildingIds: prevState.buildingIds?.filter((b) => b !== buildingId),
                              }));
                            }}
                          />
                        ))
                      )}

                      {filter.stockItemTypesIds?.length === 0 ? (
                        <ListTag
                          label="Todos os tipos"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        filter.stockItemTypesIds?.map((stockItemTypeId) => (
                          <ListTag
                            key={stockItemTypeId}
                            label={
                              stockItemTypesForSelect.find((st) => st.id === stockItemTypeId)
                                ?.name || ''
                            }
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() => {
                              setFilter((prevState) => ({
                                ...prevState,
                                stockItemTypesIds: prevState.stockItemTypesIds?.filter(
                                  (st) => st !== stockItemTypeId,
                                ),
                              }));
                            }}
                          />
                        ))
                      )}

                      {/* {filter.status?.length === 0 ? (
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
                    )} */}
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

        {loading && <DotSpinLoading />}

        {!loading && stocks.length === 0 && (
          <Style.NoDataContainer>
            <p>Nenhum tipo de item encontrado</p>
          </Style.NoDataContainer>
        )}

        {!loading && stocks.length > 0 && (
          <Table
            colsHeader={colsHeader}
            pagination
            totalCountOfRegister={stocksCount}
            registerPerPage={20}
          >
            {stocks?.map((item) => (
              <TableContent
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalStockDetails(true, item);
                }}
                colsBody={colsBody.map((col) => ({
                  cell: col.node ? (
                    col.cell(item)
                  ) : (
                    <TableCell value={col.cell(item)?.toString() || ''} type={col.type} />
                  ),
                  cssProps: col.cssProps,
                }))}
              />
            ))}
          </Table>
        )}
      </Style.Container>
    </>
  );
};
