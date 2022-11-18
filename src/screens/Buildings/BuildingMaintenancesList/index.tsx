/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import { useLocation, useNavigate } from 'react-router-dom';
import * as Style from './styles';
// import { IconButton } from '../../../components/Buttons/IconButton';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { AddedMaintenances } from './utils/types';

// FUNCTIONS
import { requestAddedMaintenances } from './utils/functions';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';

export const BuildingMaintenancesList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buildingId = state as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [addedMaintenances, setAddedMaintenances] = useState<AddedMaintenances[]>([]);

  useEffect(() => {
    if (!state) {
      navigate('/buildings');
    } else {
      requestAddedMaintenances({ setLoading, setAddedMaintenances, buildingId });
    }
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <Style.Header>
        <Style.HeaderWrapper>
          <Style.LeftSide>
            <Style.HeaderTitle>
              <h2>Manutenções a serem realizadas</h2>
            </Style.HeaderTitle>
          </Style.LeftSide>
        </Style.HeaderWrapper>
        <ReturnButton />
      </Style.Header>

      {addedMaintenances?.length ? (
        <Style.CategoriesContainer>
          {addedMaintenances.map((element) => (
            <MaintenanceCategory key={element.Category.id} data={element} />
          ))}
        </Style.CategoriesContainer>
      ) : (
        <Style.NoMaintenancesContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhuma categoria encontrada.</h3>
        </Style.NoMaintenancesContainer>
      )}
    </>
  );
};
