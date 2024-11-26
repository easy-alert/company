// LIBS
import { useEffect, useRef, useState } from 'react';

// COMPONENTS
import { useNavigate, useParams } from 'react-router-dom';
import { useMaintenancePriorities } from '@hooks/useMaintenancePriorities';
import * as Style from './styles';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { IBuildingListForSelect, ICategories, ICategoriesOptions } from './utils/types';

// FUNCTIONS
import {
  requestManageBuildingMaintenances,
  requestListCategoriesToManage,
  requestBuildingListForSelect,
  requestCategoriesForSelect,
} from './utils/functions';

import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { Select } from '../../../components/Inputs/Select';
import { DotLoading } from '../../../components/Loadings/DotLoading';
import { ITimeInterval } from '../../../utils/types';
import { query, requestListIntervals } from '../../../utils/functions';
import { ModalCreateCategory } from '../../Maintenances/List/utils/ModalCreateCategory';
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';

export const BuildingManageMaintenances = () => {
  const { account } = useAuthContext();
  const { maintenancePriorities } = useMaintenancePriorities();

  const navigate = useNavigate();

  const { buildingId } = useParams();

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [tableloading, setTableLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<ICategories[]>([]);

  const [toCopyBuilding, setToCopyBuilding] = useState<string>('');

  const [buildingName, setBuildingName] = useState<string>('');

  const [buildingListForSelect, setBuildingListForSelect] = useState<IBuildingListForSelect[]>([]);

  const [categoriesOptions, setCategoriesOptions] = useState<ICategoriesOptions[]>([]);

  const isAllCategoriesSelected = categories.every((element) =>
    element.Maintenances.every((e) => e.isSelected === true),
  );

  const hasSomeMaintenance = categories.some((element) => element.Maintenances.length > 0);

  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);

  const [modalCreateCategoryOpen, setModalCreateCategoryOpen] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('');

  const inputRef = useRef('');

  const { search } = window.location;

  useEffect(() => {
    requestCategoriesForSelect({ setCategoriesOptions });
  }, [JSON.stringify(categories)]);

  useEffect(() => {
    query.delete('flow');

    requestListIntervals({ setTimeIntervals });

    requestBuildingListForSelect({ setBuildingListForSelect, buildingId: buildingId! }).then(() => {
      requestListCategoriesToManage({
        setLoading,
        setCategories,
        buildingId: buildingId!,
        setBuildingName,
        currentBuildingId: buildingId!,
      });
    });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalCreateCategoryOpen && (
        <ModalCreateCategory
          setModal={setModalCreateCategoryOpen}
          categories={categories}
          setCategories={setCategories}
        />
      )}

      <Style.Header>
        <Style.HeaderWrapper>
          <Style.LeftSide>
            <h2>{buildingName} / Plano de manutenção</h2>
          </Style.LeftSide>

          <Style.RightSide>
            {!onQuery && (
              <IconButton
                hideLabelOnMedia
                fontWeight="500"
                label="Criar categoria"
                className="p2"
                icon={icon.plusWithBg}
                onClick={() => {
                  setModalCreateCategoryOpen(true);
                }}
              />
            )}

            {!onQuery && categories.length > 0 && hasSomeMaintenance && !tableloading && (
              <IconButton
                icon={icon.checked}
                label="Salvar"
                hideLabelOnMedia
                onClick={() => {
                  requestManageBuildingMaintenances({
                    categories,
                    buildingId: buildingId!,
                    navigate,
                    setOnQuery,
                    origin: account?.origin,
                  });
                }}
              />
            )}
          </Style.RightSide>
        </Style.HeaderWrapper>

        <Style.SearchField>
          <IconButton
            icon={icon.search}
            size="16px"
            onClick={() => {
              setFilter(inputRef.current);
            }}
          />
          <input
            type="text"
            placeholder="Procurar"
            onChange={(evt) => {
              inputRef.current = evt.target.value;

              if (evt.target.value === '') {
                setFilter('');
              }
            }}
            onKeyUp={(evt) => {
              if (evt.key === 'Enter') {
                setFilter(inputRef.current);
              }
            }}
          />
        </Style.SearchField>

        <ReturnButton path={`/buildings/details/${buildingId}${search}`} />
      </Style.Header>

      {categories.length > 0 ? (
        <>
          <Style.SelectWrapper>
            <Select
              disabled={tableloading}
              label="Copiar manutenções de:"
              value={toCopyBuilding}
              selectPlaceholderValue=" "
              onChange={(e) => {
                setToCopyBuilding(e.target.value);
                const toCopyBuildingId = e.target.value !== '' ? e.target.value : buildingId;
                requestListCategoriesToManage({
                  setLoading,
                  setCategories,
                  buildingId: toCopyBuildingId!,
                  setTableLoading,
                  setBuildingName,
                  currentBuildingId: buildingId!,
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

            {!tableloading && (
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

                    const updatedCategories = structuredClone(categories);

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
            )}
          </Style.SelectWrapper>

          {tableloading ? (
            <Style.TableLoadingContainer>
              <DotLoading label="Carregando tabela" />
            </Style.TableLoadingContainer>
          ) : (
            <Style.CategoriesContainer>
              {categories.map((category, categoryIndex: number) => {
                const filteredMaintenances = category.Maintenances.filter(
                  (maintenance) =>
                    maintenance.element.toLowerCase().includes(filter.toLowerCase()) ||
                    maintenance.activity.toLowerCase().includes(filter.toLowerCase()) ||
                    maintenance.frequency.toString().includes(filter) ||
                    maintenance.responsible.toLowerCase().includes(filter.toLowerCase()) ||
                    maintenance.source.toLowerCase().includes(filter.toLowerCase()),
                );

                if (
                  filter === '' ||
                  category.name.toLowerCase().includes(filter.toLowerCase()) ||
                  filteredMaintenances.length > 0
                ) {
                  const categoryWithFilteredMaintenances = {
                    ...category,
                    Maintenances: filteredMaintenances,
                  };

                  return (
                    <MaintenanceCategory
                      key={category.id}
                      category={categoryWithFilteredMaintenances}
                      categories={categories}
                      setCategories={setCategories}
                      categoryIndex={categoryIndex}
                      setToCopyBuilding={setToCopyBuilding}
                      toCopyBuilding={toCopyBuilding}
                      timeIntervals={timeIntervals}
                      categoriesOptions={categoriesOptions}
                      maintenancePriorities={maintenancePriorities}
                    />
                  );
                }
                return null;
              })}
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
