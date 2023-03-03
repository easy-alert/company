/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import { useNavigate, useParams } from 'react-router-dom';
import * as Style from './styles';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { AddedMaintenances } from './utils/types';

// FUNCTIONS
import { requestAddedMaintenances } from './utils/functions';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { IconButton } from '../../../components/Buttons/IconButton';

export const BuildingMaintenancesList = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [addedMaintenances, setAddedMaintenances] = useState<AddedMaintenances[]>([]);

  useEffect(() => {
    requestAddedMaintenances({
      setLoading,
      setAddedMaintenances,
      buildingId: buildingId!,
    });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <Style.Header>
        <Style.HeaderWrapper>
          <Style.LeftSide>
            <Style.HeaderTitle>
              <h2>{addedMaintenances[0]?.Building?.name} / Plano de manutenções</h2>
            </Style.HeaderTitle>
          </Style.LeftSide>
          <IconButton
            icon={icon.editWithBg}
            label="Editar"
            hideLabelOnMedia
            onClick={() => {
              navigate(`/buildings/details/${buildingId}/maintenances/manage`);
            }}
          />
        </Style.HeaderWrapper>
        <ReturnButton path={`/buildings/details/${buildingId}`} />
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
          <h3>Nenhuma categoria ou manutenção encontrada.</h3>
        </Style.NoMaintenancesContainer>
      )}
    </>
  );
};
