// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useNavigate } from 'react-router-dom';

// SERVICES
import { Api } from '@services/api';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useBrasilStates } from '@hooks/useBrasilStates';
import { useBrasilCities } from '@hooks/useBrasilCities';
import { useCategoriesByCompanyId } from '@hooks/useCategoriesByCompanyId';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { Select } from '@components/Inputs/Select';
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { Pagination } from '@components/Pagination';
import { ListTag } from '@components/ListTag';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ImageComponent } from '@components/ImageComponent';
import { Table, TableContent } from '@components/Table';

// UTILS
import { applyMask, catchHandler, convertStateName } from '@utils/functions';

// ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { ISupplier } from '@customTypes/ISupplier';

// COMPONENTS
import { ModalCreateSupplier } from './ModalCreateSupplier';

// STYLES
import * as Style from './styles';
import { NoDataContainer, PaginationFooter } from '../../Tickets/styles';

type TListView = 'blocks' | 'table';

export const SuppliersList = () => {
  const navigate = useNavigate();

  const { account } = useAuthContext();
  const { states, selectedStateAcronym, setSelectedStateAcronym } = useBrasilStates();
  const { cities } = useBrasilCities({ UF: selectedStateAcronym });
  const { allCategories } = useCategoriesByCompanyId(account?.Company?.id || '');

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [supplierCounts, setSupplierCounts] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [modalCreateSupplierOpen, setModalCreateSupplierOpen] = useState(false);
  const [listView, setListView] = useState<TListView>('blocks');
  const [onQuery, setOnQuery] = useState(false);
  const [filter, setFilter] = useState({ search: '', serviceTypeLabel: '', state: '', city: '' });

  const handleListView = (view: TListView) => {
    setListView(view);
  };

  const findManySuppliers = async (pageParam?: number) => {
    await Api.get(`/suppliers?page=${pageParam || page}&filter=${JSON.stringify(filter)}`)
      .then((res) => {
        setSuppliers(res.data.suppliers);
        setSupplierCounts(res.data.suppliersCount);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
        setOnQuery(false);
      });
  };

  useEffect(() => {
    if (filter.search === '') {
      findManySuppliers();
    }
  }, [filter.search]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <Style.Container>
        {modalCreateSupplierOpen && (
          <ModalCreateSupplier
            setModal={setModalCreateSupplierOpen}
            onThenRequest={async () => {
              findManySuppliers();
            }}
          />
        )}

        <Style.Header>
          <Style.LeftSide>
            <h2>Fornecedores</h2>

            <IconButton
              hasCircle
              labelPos="right"
              label={listView === 'table' ? 'Visualizar em blocos' : 'Visualizar em lista'}
              icon={listView === 'table' ? icon.blocks : icon.listWithBg}
              onClick={() => {
                handleListView(listView === 'table' ? 'blocks' : 'table');
              }}
            />

            {/*
          <Style.SearchField>
            <IconButton
              icon={icon.search}
              size="16px"
              onClick={() => {
                findManySuppliers(search);
              }}
            />
            <input
              type="text"
              placeholder="Procurar"
              value={search}
              onChange={(evt) => {
                setSearch(evt.target.value);
                if (evt.target.value === '') {
                  findManySuppliers('');
                }
              }}
              onKeyUp={(evt) => {
                if (evt.key === 'Enter') {
                  findManySuppliers(search);
                }
              }}
            />
          </Style.SearchField> */}
          </Style.LeftSide>
          <IconButton
            hasCircle
            hideLabelOnMedia
            fontWeight="500"
            label="Cadastrar"
            className="p2"
            icon={icon.plusWithBg}
            onClick={() => {
              setModalCreateSupplierOpen(true);
            }}
          />
        </Style.Header>

        <Style.FilterWrapper>
          <h5>Filtros</h5>

          <Style.FilterInputs>
            <Input
              label="Busca"
              placeholder="Digite o parâmetro de busca"
              value={filter.search}
              onChange={(evt) => {
                setFilter((prev) => ({ ...prev, search: evt.target.value }));
              }}
              onKeyUp={({ key }) => {
                if (key === 'Enter') {
                  findManySuppliers();
                }
              }}
            />

            <Select
              label="Categorias"
              arrowColor="primary"
              value={filter.serviceTypeLabel}
              selectPlaceholderValue={filter.serviceTypeLabel}
              onChange={(evt) => {
                setFilter((prev) => ({ ...prev, serviceTypeLabel: evt.target.value }));
              }}
            >
              <option value="">Todas</option>

              {allCategories.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </Select>

            <Select
              value={filter.state}
              selectPlaceholderValue={filter.state}
              label="Estado"
              arrowColor="primary"
              onChange={(evt) => {
                setFilter((prev) => ({ ...prev, state: evt.target.value, city: '' }));

                setSelectedStateAcronym(convertStateName(evt.target.value));
              }}
            >
              <option value="">Todos</option>
              {states.map(({ nome }) => (
                <option value={nome} key={nome}>
                  {nome}
                </option>
              ))}
            </Select>

            <Select
              label="Cidade"
              arrowColor="primary"
              value={filter.city}
              selectPlaceholderValue={filter.city}
              onChange={(evt) => {
                setFilter((prev) => ({ ...prev, city: evt.target.value }));
              }}
            >
              <option value="">Todas</option>

              {cities.map(({ nome }) => (
                <option value={nome} key={nome}>
                  {nome}
                </option>
              ))}
            </Select>
            <Button
              bgColor="primary"
              loading={onQuery}
              label="Filtrar"
              onClick={() => {
                setOnQuery(true);
                findManySuppliers();
              }}
            />
          </Style.FilterInputs>
        </Style.FilterWrapper>

        {suppliers?.length > 0 && (
          <Style.PaginationContainer>
            {listView === 'blocks' ? (
              <Style.Wrapper>
                {suppliers.map((supplier) => (
                  <Style.Card key={supplier.id} to={`/suppliers/${supplier.id}`}>
                    <Style.ImageDiv>
                      <Image img={supplier.image} size="100px" />
                    </Style.ImageDiv>

                    <Style.CardContent>
                      <h5>{supplier.name}</h5>

                      <Style.Tags>
                        {supplier.categories.map(({ category }) => (
                          <ListTag
                            key={category.id}
                            label={category.name}
                            fontSize="14px"
                            lineHeight="16px"
                          />
                        ))}
                      </Style.Tags>

                      <p className="p">{`${supplier.city} / ${supplier.state}`}</p>
                    </Style.CardContent>

                    <Style.CardFooter>
                      <Style.Line />
                      <p className="p4">
                        {supplier.phone
                          ? applyMask({ mask: 'TEL', value: supplier.phone }).value
                          : '-'}
                      </p>
                      <p className="p4">{supplier.email || '-'}</p>
                    </Style.CardFooter>
                  </Style.Card>
                ))}
              </Style.Wrapper>
            ) : (
              <Table
                colsHeader={[
                  { label: 'Nome', cssProps: { paddingLeft: '56px' } },
                  { label: 'Área de atuação' },
                  { label: 'Cidade / Estado' },
                  { label: 'Telefone' },
                  { label: 'Email' },
                ]}
              >
                {suppliers.map((supplier) => (
                  <TableContent
                    onClick={() => {
                      navigate(`/suppliers/${supplier.id}`);
                    }}
                    key={supplier.id}
                    colsBody={[
                      {
                        cell: (
                          <Style.NameAndImage>
                            <ImageComponent src={supplier.image} size="32px" radius="100%" />
                            {supplier.name}
                          </Style.NameAndImage>
                        ),
                        cssProps: { width: '20%', minWidth: '200px' },
                      },
                      {
                        cell: supplier.categories.map(({ category }) => category.name).join(', '),
                        cssProps: { width: '40%', minWidth: '200px' },
                      },
                      {
                        cell: `${supplier.city} / ${supplier.state}`,
                        cssProps: { width: '15%', minWidth: '150px' },
                      },
                      {
                        cell: supplier.phone
                          ? applyMask({ mask: 'TEL', value: supplier.phone }).value
                          : '-',
                        cssProps: { width: '10%', minWidth: '150px' },
                      },
                      { cell: supplier.email || '-', cssProps: { width: '10%' } },
                    ]}
                  />
                ))}
              </Table>
            )}
            <PaginationFooter>
              <Pagination
                totalCountOfRegister={supplierCounts}
                currentPage={page}
                registerPerPage={10}
                onPageChange={(pageParam) => {
                  setPage(pageParam);
                  findManySuppliers(pageParam);
                }}
              />
            </PaginationFooter>
          </Style.PaginationContainer>
        )}
      </Style.Container>
      {suppliers.length === 0 && (
        <NoDataContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhum fornecedor encontrado.</h3>
        </NoDataContainer>
      )}
    </>
  );
};
