// REACT
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { icon } from '@assets/icons/index';
import { Image } from '@components/Image';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Pagination } from '@components/Pagination';
import { Select } from '@components/Inputs/Select';

// GLOBAL FUNCTIONS
import { capitalizeFirstLetter, requestBuildingTypes } from '@utils/functions';

// GLOBAL ICONS
import IconRightArrow from '@assets/icons/IconRightArrow';
import IconSearch from '@assets/icons/IconSearch';
import IconPlus from '@assets/icons/IconPlus';

// GLOBAL TYPES
import type { IBuildingTypes } from '@utils/types';

// MODALS
import { ModalCreateBuilding } from './utils/ModalCreateBuilding';
import { requestBuildingList } from './utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IBuildingList } from './utils/types';

interface IFilterType {
  value: 'mostRecent' | 'oldest' | 'mostScore' | 'leastScore' | '';
  label: string;
}

const filterTypes: IFilterType[] = [
  { value: '', label: 'Filtrar por' },
  { value: 'mostRecent', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'mostScore', label: 'Mais pontuados' },
  { value: 'leastScore', label: 'Menos pontuados' },
];

export const BuildingsList = () => {
  const { account } = useContext(AuthContext);

  const navigate = useNavigate();

  const [modalCreateBuildingOpen, setModalCreateBuildingOpen] = useState<boolean>(false);
  const [buildingList, setBuildingList] = useState<IBuildingList[]>([]);

  const [buildingTypes, setBuildingTypes] = useState<IBuildingTypes[]>([]);

  // FILTER
  const [filter, setFilter] = useState<string>('');
  const [filterType, setFilterType] = useState<IFilterType['value']>('');
  const [loading, setLoading] = useState<boolean>(true);

  // PAGINATION
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const offset = 100;

  const [search] = useSearchParams();
  const queryPage = Number(search.get('page'));
  const queryFilter = search.get('filter');
  const queryFilterType = search.get('filterType');

  useEffect(() => {
    if (queryPage) setPage(queryPage);
    if (queryFilter) setFilter(queryFilter);
    if (queryFilterType) setFilterType(queryFilterType as IFilterType['value']);

    requestBuildingTypes({ setBuildingTypes }).then(() => {
      requestBuildingList({
        page: queryPage || page,
        filter: queryFilter || filter,
        filterType: queryFilterType || filterType,
        setBuildingList,
        setCount,
        setLoading,
      });
    });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalCreateBuildingOpen && (
        <ModalCreateBuilding buildingTypes={buildingTypes} setModal={setModalCreateBuildingOpen} />
      )}
      <Style.Header>
        <Style.LeftSide>
          <h2>Edificações</h2>

          <Style.SelectWrapper>
            <Select
              name="filterType"
              value={filterType}
              selectPlaceholderValue="Filtrar por"
              onChange={(evt) => {
                setFilterType(evt.target.value as IFilterType['value']);

                requestBuildingList({
                  setBuildingList,
                  page: 1,
                  setCount,
                  filter,
                  filterType: evt.target.value as IFilterType['value'],
                  setPage,
                  resetPage: true,
                });
              }}
            >
              {filterTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </Style.SelectWrapper>

          <Style.SearchField>
            <IconButton
              icon={<IconSearch strokeColor="primary" />}
              size="16px"
              onClick={() => {
                requestBuildingList({
                  setBuildingList,
                  page: 1,
                  setCount,
                  filter,
                  filterType,
                  setPage,
                  resetPage: true,
                });
              }}
            />
            <input
              type="text"
              placeholder="Procurar"
              value={filter}
              onChange={(evt) => {
                console.log('🚀 ~ evt:', evt.target.value);
                setFilter(evt.target.value);

                if (evt.target.value === '') {
                  requestBuildingList({
                    setBuildingList,
                    page: 1,
                    setCount,
                    filter: '',
                    filterType: '',
                    setPage,
                    resetPage: true,
                  });
                }
              }}
              onKeyUp={(evt) => {
                if (evt.key === 'Enter') {
                  requestBuildingList({
                    setBuildingList,
                    page: 1,
                    setCount,
                    filter,
                    filterType,
                    setPage,
                    resetPage: true,
                  });
                }
              }}
            />
          </Style.SearchField>
        </Style.LeftSide>

        <IconButton
          hideLabelOnMedia
          fontWeight="500"
          label="Cadastrar"
          className="p2"
          icon={<IconPlus strokeColor="primary" />}
          permToCheck="buildings:create"
          onClick={() => setModalCreateBuildingOpen(true)}
        />
      </Style.Header>

      {buildingList.length > 0 ? (
        <Style.Content>
          <Style.GridContainer>
            {buildingList
              .filter((building) => {
                if (
                  account?.User.Permissions?.findIndex(
                    (permission) => permission.Permission.name === 'admin:company',
                  ) === 0
                )
                  return true;

                const buildingId = building.id;

                return (
                  buildingId ===
                  account?.User.BuildingsPermissions?.find(
                    (permission) => permission.Building.id === buildingId,
                  )?.Building.id
                );
              })
              .map((building) => (
                <Style.BuildingCard
                  key={building.id}
                  onClick={() =>
                    navigate(
                      `/buildings/details/${building.id}?page=${page}&filter=${filter}&filterType=${filterType}`,
                    )
                  }
                >
                  <Style.BuildingCardHeader>
                    <Style.BuildingCardHeaderInfo>
                      <h5>{building.name}</h5>
                      <p className="p3">
                        {building?.neighborhood}
                        {building?.city && building?.neighborhood
                          ? `, ${building?.city}`
                          : building.city}
                      </p>
                    </Style.BuildingCardHeaderInfo>

                    <Image img={<IconRightArrow strokeColor="primary" />} size="16px" />
                  </Style.BuildingCardHeader>

                  <Style.BuildingCardFooter>
                    {/* Não fiz .map pra facilitar a estilização */}
                    <Style.BuildingCardFooterInfo>
                      <h5 className="completed">{building?.MaintenancesCount[0].count}</h5>
                      <p className="p5">
                        {building?.MaintenancesCount[0].count > 1
                          ? capitalizeFirstLetter(building?.MaintenancesCount[0].pluralLabel)
                          : capitalizeFirstLetter(building?.MaintenancesCount[0].singularLabel)}
                      </p>
                    </Style.BuildingCardFooterInfo>

                    <Style.BuildingCardFooterInfo>
                      <h5 className="pending">{building?.MaintenancesCount[1].count}</h5>
                      <p className="p5">
                        {building?.MaintenancesCount[1].count > 1
                          ? capitalizeFirstLetter(building?.MaintenancesCount[1].pluralLabel)
                          : capitalizeFirstLetter(building?.MaintenancesCount[1].singularLabel)}
                      </p>
                    </Style.BuildingCardFooterInfo>

                    <Style.BuildingCardFooterInfo>
                      <h5 className="expired">{building?.MaintenancesCount[2].count}</h5>
                      <p className="p5">
                        {building?.MaintenancesCount[2].count > 1
                          ? capitalizeFirstLetter(building?.MaintenancesCount[2].pluralLabel)
                          : capitalizeFirstLetter(building?.MaintenancesCount[2].singularLabel)}
                      </p>
                    </Style.BuildingCardFooterInfo>

                    <Style.BuildingCardFooterInfo>
                      <h5 className="tickets">{building?.ticketsCount ?? 0}</h5>
                      <p className="p5">Chamados</p>
                    </Style.BuildingCardFooterInfo>
                  </Style.BuildingCardFooter>
                </Style.BuildingCard>
              ))}
          </Style.GridContainer>

          <Style.PaginationFooter>
            <Pagination
              totalCountOfRegister={count}
              currentPage={page}
              registerPerPage={offset}
              // eslint-disable-next-line no-shadow
              onPageChange={(page) => {
                setPage(page);
                requestBuildingList({
                  setBuildingList,
                  setLoading,
                  page,
                  setCount,
                  filter,
                });
              }}
            />
          </Style.PaginationFooter>
        </Style.Content>
      ) : (
        <Style.NoDataContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhuma edificação encontrada. </h3>
        </Style.NoDataContainer>
      )}
    </>
  );
};
