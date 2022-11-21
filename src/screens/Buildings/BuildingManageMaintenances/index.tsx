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
import { IBuildingListForSelect, ICategories } from './utils/types';

// FUNCTIONS
import {
  requestManageBuildingMaintenances,
  requestListCategoriesToManage,
  requestBuldingListForSelect,
} from './utils/functions';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { Select } from '../../../components/Inputs/Select';
import { DotLoading } from '../../../components/Loadings/DotLoading';

export const BuildingManageMaintenances = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buildingId = state as string;

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [tableloading, setTableLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<ICategories[]>([]);

  const [toCopyBuilding, setToCopyBuilding] = useState<string>('');

  const [buildingListForSelect, setBuildingListForSelect] = useState<IBuildingListForSelect[]>([]);

  const isAllCategoriesSelected = categories.every((element) =>
    element.Maintenances.every((e) => e.isSelected === true),
  );

  const hasSomeMaintenance = categories.some((element) => element.Maintenances.length > 0);

  useEffect(() => {
    if (!state) {
      navigate('/buildings');
    } else {
      requestBuldingListForSelect({ setBuildingListForSelect });
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
          {!onQuery && categories.length > 0 && hasSomeMaintenance && (
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
      {categories.length > 0 && hasSomeMaintenance ? (
        <>
          <Style.SelectWrapper>
            <Select
              label="Copiar manutenções de:"
              value={toCopyBuilding}
              selectPlaceholderValue=" "
              onChange={(e) => {
                setToCopyBuilding(e.target.value);
                const toCopyBuildingId = e.target.value !== '' ? e.target.value : buildingId;
                requestListCategoriesToManage({
                  setLoading,
                  setCategories,
                  buildingId: toCopyBuildingId,
                  setTableLoading,
                });
              }}
            >
              <option value="">Não copiar</option>
              {buildingListForSelect.map((element) => (
                <option key={element.id} value={element.id}>
                  {element.name}
                </option>
              ))}
            </Select>

            <label htmlFor="selectAll">
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                checked={isAllCategoriesSelected}
                onChange={() => {
                  if (toCopyBuilding !== '') {
                    setToCopyBuilding('');
                  }

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
          {tableloading ? (
            <Style.TableLoadingContainer>
              <DotLoading label="Carregando tabela..." />
            </Style.TableLoadingContainer>
          ) : (
            <Style.CategoriesContainer>
              {categories.map(
                (category, categoryIndex: number) =>
                  category.Maintenances.length > 0 && (
                    <MaintenanceCategory
                      key={category.id}
                      category={category}
                      categories={categories}
                      setCategories={setCategories}
                      categoryIndex={categoryIndex}
                      setToCopyBuilding={setToCopyBuilding}
                      toCopyBuilding={toCopyBuilding}
                    />
                  ),
              )}
            </Style.CategoriesContainer>
          )}
        </>
      ) : (
        <Style.NoMaintenancesContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhuma categoria ou manutenção encontrada.</h3>
        </Style.NoMaintenancesContainer>
      )}
    </>
  );
};
