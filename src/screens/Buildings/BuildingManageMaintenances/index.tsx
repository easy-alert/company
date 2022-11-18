/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import { useLocation, useNavigate } from 'react-router-dom';
import * as Style from './styles';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { ICategories } from './utils/types';

// FUNCTIONS
import {
  requestManageBuildingMaintenances,
  requestListCategoriesToManage,
} from './utils/functions';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { Select } from '../../../components/Inputs/Select';

export const BuildingManageMaintenances = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buildingId = state as string;

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<ICategories[]>([]);

  const isAllCategoriesSelected = categories.every((element) =>
    element.Maintenances.every((e) => e.isSelected === true),
  );

  useEffect(() => {
    if (!state) {
      navigate('/buildings');
    } else {
      requestListCategoriesToManage({ setLoading, setCategories, buildingId });
    }
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <Style.Header>
        <Style.HeaderWrapper>
          <Style.LeftSide>
            <h2>Manutenções a serem realizadas</h2>
          </Style.LeftSide>
          {!onQuery && (
            <IconButton
              icon={icon.checked}
              label="Salvar"
              hideLabelOnMedia
              onClick={() => {
                requestManageBuildingMaintenances({ categories, buildingId, navigate, setOnQuery });
              }}
            />
          )}
        </Style.HeaderWrapper>
        <ReturnButton />
      </Style.Header>

      <Style.SelectWrapper>
        <Select label="Copiar manutenções de:" selectPlaceholderValue=" ">
          <option value="" disabled hidden>
            Selecione
          </option>
        </Select>

        <label htmlFor="selectAll">
          <input
            type="checkbox"
            id="selectAll"
            name="selectAll"
            checked={isAllCategoriesSelected}
            onChange={() => {
              const updatedCategories = categories;

              if (isAllCategoriesSelected) {
                for (let i = 0; i < updatedCategories.length; i += 1) {
                  for (let j = 0; j < updatedCategories[i].Maintenances.length; j += 1) {
                    updatedCategories[i].Maintenances[j].isSelected = false;
                  }
                }
              } else {
                for (let i = 0; i < updatedCategories.length; i += 1) {
                  for (let j = 0; j < updatedCategories[i].Maintenances.length; j += 1) {
                    updatedCategories[i].Maintenances[j].isSelected = true;
                  }
                }
              }

              setCategories([...updatedCategories]);
            }}
          />
          {isAllCategoriesSelected
            ? 'Desselecionar todas as manutenções'
            : 'Selecionar todas as manutenções'}
        </label>
      </Style.SelectWrapper>

      {categories?.length ? (
        <Style.CategoriesContainer>
          {categories.map((category, categoryIndex: number) => (
            <MaintenanceCategory
              key={category.id}
              category={category}
              categories={categories}
              setCategories={setCategories}
              categoryIndex={categoryIndex}
            />
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
