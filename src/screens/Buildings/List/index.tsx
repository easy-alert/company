// COMPONENTS
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../components/Buttons/IconButton';
import { icon } from '../../../assets/icons/index';
import { Image } from '../../../components/Image';

// STYLES
import * as Style from './styles';

// MODALS
import { ModalCreateBuilding } from './utils/ModalCreateBuilding';
import { requestBuildingList } from './utils/functions';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';

// TYPES
import { IBuildingList } from './utils/types';
import { Pagination } from '../../../components/Pagination';

export const BuildingsList = () => {
  const navigate = useNavigate();

  const [modalCreateBuildingOpen, setModalCreateBuildingOpen] = useState<boolean>(false);
  const [buildingList, setBuildingList] = useState<IBuildingList[]>([]);

  // FILTER
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // PAGINATION
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const offset = 20;

  useEffect(() => {
    requestBuildingList({ page, setBuildingList, setCount, filter, setLoading, setPage });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalCreateBuildingOpen && <ModalCreateBuilding setModal={setModalCreateBuildingOpen} />}
      <Style.Header>
        <Style.LeftSide>
          <h2>Edificações</h2>

          <Style.SearchField>
            <IconButton
              icon={icon.search}
              size="16px"
              onClick={() => {
                requestBuildingList({
                  setBuildingList,
                  page: 1,
                  setCount,
                  filter,
                  setPage,
                });
              }}
            />
            <input
              type="text"
              maxLength={40}
              placeholder="Procurar"
              value={filter}
              onChange={(evt) => {
                setFilter(evt.target.value);
                if (evt.target.value === '') {
                  requestBuildingList({
                    setBuildingList,
                    page: 1,
                    setCount,
                    filter: '',
                    setPage,
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
                    setPage,
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
          icon={icon.plusWithBg}
          onClick={() => {
            setModalCreateBuildingOpen(true);
          }}
        />
      </Style.Header>

      {buildingList.length > 0 ? (
        <>
          <Style.GridContainer>
            {buildingList.map((building) => (
              // eslint-disable-next-line react/no-array-index-key
              <Style.BuildingCard
                key={building.id}
                onClick={() => {
                  navigate('/buildings/details');
                }}
              >
                <Style.BuildingCardHeader>
                  <Style.BuildingCardHeaderInfo>
                    <h5>{building.name}</h5>
                    <p className="p3">
                      {building.neighborhood} {building.city}
                    </p>
                  </Style.BuildingCardHeaderInfo>

                  <Image img={icon.rightArrow} size="16px" />
                </Style.BuildingCardHeader>

                <Style.BuildingCardFooter>
                  <Style.BuildingCardFooterInfo>
                    <h5 className="pending">0</h5>
                    <p className="p5">Pendentes</p>

                    <h5 className="delayed">0</h5>
                    <p className="p5">Feitas em atraso</p>
                  </Style.BuildingCardFooterInfo>
                  <Style.BuildingCardFooterInfo>
                    <h5 className="expired">0</h5>
                    <p className="p5">Vencidas</p>

                    <h5 className="completed">0</h5>
                    <p className="p5">Concluídas</p>
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
        </>
      ) : (
        <Style.NoDataContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhuma edificação encontrada. </h3>
        </Style.NoDataContainer>
      )}
    </>
  );
};
