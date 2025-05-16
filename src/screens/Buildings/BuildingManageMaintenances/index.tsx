// REACT
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useMaintenancePriorities } from '@hooks/useMaintenancePriorities';

// COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ReturnButton } from '@components/Buttons/ReturnButton';
import { Select } from '@components/Inputs/Select';
import { DotLoading } from '@components/Loadings/DotLoading';
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { icon } from '@assets/icons';
import IconSearch from '@assets/icons/IconSearch';
import IconCheck from '@assets/icons/IconCheck';
import IconPlus from '@assets/icons/IconPlus';
import { ITimeInterval } from '@utils/types';
import { ModalCreateCategory } from '../../Maintenances/List/utils/ModalCreateCategory';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// FUNCTIONS
import {
  requestManageBuildingMaintenances,
  requestListCategoriesToManage,
  requestCategoriesForSelect,
} from './utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IBuildingListForSelect, ICategories, ICategoriesOptions } from './utils/types';

export const BuildingManageMaintenances = () => {
  type LocalStorageData = {
    categories: ICategories[];
    toCopyBuilding: string;
    filter: string;
  };

  const { buildingId } = useParams();
  const { account } = useAuthContext();
  const { maintenancePriorities } = useMaintenancePriorities();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [localData, setLocalData] = useState<LocalStorageData | null>(null);
  const [apiData, setApiData] = useState([]);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [toCopyBuilding, setToCopyBuilding] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');
  const [buildingListForSelect, setBuildingListForSelect] = useState<IBuildingListForSelect[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<ICategoriesOptions[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [tableloading, setTableLoading] = useState<boolean>(false);
  const [modalCreateCategoryOpen, setModalCreateCategoryOpen] = useState<boolean>(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);

  const inputRef = useRef('');

  const { search } = window.location;

  const isAllCategoriesSelected = categories.every((element) =>
    element.Maintenances.every((e) => e.isSelected === true),
  );

  const hasSomeMaintenance = categories.some((element) => element.Maintenances.length > 0);

  useEffect(() => {
    requestCategoriesForSelect({ setCategoriesOptions });
  }, [buildingId]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setShowModal(false);

      try {
        const categoriesFromApi = await requestListCategoriesToManage({
          setCategories: () => null,
          buildingId: buildingId!,
          setBuildingName,
          currentBuildingId: buildingId!,
          setTableLoading,
          setLoading,
        });

        setCategories(categoriesFromApi);
        setApiData(JSON.parse(JSON.stringify(categoriesFromApi)));

        const savedData = localStorage.getItem(`maint-categories-${buildingId}`);
        if (savedData) {
          try {
            const parsedData: LocalStorageData = JSON.parse(savedData);

            if (parsedData.categories && parsedData.categories.length > 0) {
              const hasChanges =
                JSON.stringify(parsedData.categories) !== JSON.stringify(categoriesFromApi);
              if (hasChanges) {
                setLocalData(parsedData);
                setShowModal(true);
              } else {
                localStorage.removeItem(`maint-categories-${buildingId}`);
              }
            }
          } catch (error) {
            localStorage.removeItem(`maint-categories-${buildingId}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (buildingId) fetchCategories();
  }, [buildingId]);

  useEffect(() => {
    if (!loading && buildingId) {
      const dataToSave: LocalStorageData = {
        categories,
        toCopyBuilding,
        filter,
      };
      localStorage.setItem(`maint-categories-${buildingId}`, JSON.stringify(dataToSave));
    }
  }, [categories, toCopyBuilding, filter, buildingId, loading]);

  const handleRestoreLocalData = () => {
    if (localData) {
      setCategories(localData.categories);
      setToCopyBuilding(localData.toCopyBuilding);
      setFilter(localData.filter);
    }
    setShowModal(false);
  };

  const handleDiscardLocalData = async () => {
    localStorage.removeItem(`maint-categories-${buildingId}`);

    setLoading(true);
    const freshData = await requestListCategoriesToManage({
      setCategories,
      buildingId: buildingId!,
      setBuildingName,
      currentBuildingId: buildingId!,
      setTableLoading,
      setLoading,
    });

    setApiData(JSON.parse(JSON.stringify(freshData)));
    setLocalData(null);
    setShowModal(false);
  };

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
                label="Criar categoria"
                icon={<IconPlus strokeColor="primary" />}
                fontWeight="500"
                className="p2"
                hideLabelOnMedia
                onClick={() => setModalCreateCategoryOpen(true)}
              />
            )}

            {!onQuery && categories.length > 0 && hasSomeMaintenance && !tableloading && (
              <IconButton
                label="Salvar"
                icon={<IconCheck strokeColor="primary" size="24px" />}
                hideLabelOnMedia
                onClick={() => {
                  localStorage.removeItem(`maint-categories-${buildingId}`);
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
            fill="primary"
            icon={<IconSearch strokeColor="primary" />}
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
              arrowColor="primary"
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

      {showModal && localData && (
        <Modal title="Alterações não salvas" setModal={setShowModal}>
          <Style.ModalContent>
            <p>Você tem dados não salvos, deseja restaurar?</p>

            <Style.ButtonContainer>
              <Button bgColor="primary" label="Sim" onClick={handleRestoreLocalData} />
              <Button borderless label="Descartar" onClick={handleDiscardLocalData} />
            </Style.ButtonContainer>
          </Style.ModalContent>
        </Modal>
      )}
    </>
  );
};
