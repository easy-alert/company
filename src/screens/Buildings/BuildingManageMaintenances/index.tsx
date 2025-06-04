// REACT
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useMaintenancePriorities } from '@hooks/useMaintenancePriorities';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ReturnButton } from '@components/Buttons/ReturnButton';
import { Select } from '@components/Inputs/Select';
import { DotLoading } from '@components/Loadings/DotLoading';
import { icon } from '@assets/icons';
import { ITimeInterval } from '@utils/types';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { ModalCreateCategory } from '@screens/Maintenances/List/utils/ModalCreateCategory';

// GLOBAL UTILS
import { autosaveDB } from '@utils/autosaveDB';
import { handleToastifyMessage } from '@utils/toastifyResponses';
import { query, requestListIntervals } from '@utils/functions';

// GLOBAL ASSETS
import IconSearch from '@assets/icons/IconSearch';
import IconCheck from '@assets/icons/IconCheck';
import IconPlus from '@assets/icons/IconPlus';

// COMPONENTS
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// UTILS
import {
  requestManageBuildingMaintenances,
  requestListCategoriesToManage,
  requestCategoriesForSelect,
  requestBuildingListForSelect,
  getChangedCategories,
  mergeCategories,
} from './utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IBuildingListForSelect, ICategories, ICategoriesOptions } from './utils/types';

export type LocalStorageData = {
  categories: ICategories[];
};

export const BuildingManageMaintenances = () => {
  const { account } = useAuthContext();

  const { maintenancePriorities } = useMaintenancePriorities();

  const { buildingId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef('');

  const { search } = window.location;

  const [buildingName, setBuildingName] = useState<string>('');
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [originalCategories, setOriginalCategories] = useState<ICategories[]>([]);
  const [localData, setLocalData] = useState<LocalStorageData | null>(null);

  const [buildingListForSelect, setBuildingListForSelect] = useState<IBuildingListForSelect[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<ICategoriesOptions[]>([]);
  const [toCopyBuilding, setToCopyBuilding] = useState<string>('');

  const [filter, setFilter] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [tableloading, setTableLoading] = useState<boolean>(false);

  const [modalCreateCategoryOpen, setModalCreateCategoryOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);

  const isAllCategoriesSelected = useMemo(
    () => categories.every((element) => element.Maintenances.every((e) => e.isSelected === true)),
    [categories],
  );

  const hasSomeMaintenance = useMemo(
    () => categories.some((element) => element.Maintenances.length > 0),
    [categories],
  );

  const handleRestoreLocalData = () => {
    setLoading(true);

    if (localData) {
      const merged = mergeCategories(originalCategories, localData.categories);
      if (JSON.stringify(categories) !== JSON.stringify(merged)) {
        setCategories(merged);
        handleToastifyMessage({
          message: 'Dados locais restaurados com sucesso',
          type: 'success',
        });
      }
    } else {
      handleToastifyMessage({
        message: 'Nenhum dado local encontrado, restaurando dados da API',
        type: 'warning',
      });
      autosaveDB.remove(`maint-categories-${buildingId}`);
      setCategories(originalCategories);
      setLocalData(null);
    }

    setTimeout(() => {
      setShowModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleDiscardLocalData = async () => {
    setLoading(true);

    autosaveDB.remove(`maint-categories-${buildingId}`);

    handleToastifyMessage({
      message: 'Dados locais descartados, restaurando dados da API',
      type: 'warning',
    });
    setCategories(originalCategories);
    setLocalData(null);

    setTimeout(() => {
      setShowModal(false);
      setLoading(false);
    }, 1000);
  };

  function useDebouncedEffect(effect: () => void, deps: any[], delay: number) {
    const handler = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (handler.current) clearTimeout(handler.current);
      handler.current = setTimeout(effect, delay);

      return () => {
        if (handler.current) clearTimeout(handler.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setShowModal(false);

      try {
        const categoriesFromApi = await requestListCategoriesToManage({
          buildingId: buildingId!,
          currentBuildingId: buildingId!,
          setCategories: () => null,
          setBuildingName,
          setTableLoading,
          setLoading,
        });

        setOriginalCategories(structuredClone(categoriesFromApi));
        setCategories(categoriesFromApi);

        const savedData = await autosaveDB.load(`maint-categories-${buildingId}`);

        if (savedData) {
          if (savedData.categories && savedData.categories.length > 0) {
            const hasChanges = savedData.categories !== categoriesFromApi;

            if (hasChanges) {
              setShowModal(true);
              setLocalData(savedData);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (buildingId) {
      localStorage.removeItem(`maint-categories-${buildingId}`);

      query.delete('flow');

      requestListIntervals({ setTimeIntervals });

      requestListIntervals({ setTimeIntervals });
      requestCategoriesForSelect({ setCategoriesOptions });
      requestBuildingListForSelect({ setBuildingListForSelect, buildingId: buildingId! });
      fetchCategories();
    }
  }, [buildingId]);

  useDebouncedEffect(
    () => {
      if (buildingId && categories.length > 0) {
        const changedCategories = getChangedCategories(categories, originalCategories);

        if (changedCategories.length > 0) {
          autosaveDB.save(`maint-categories-${buildingId}`, { categories: changedCategories });
        } else {
          autosaveDB.remove(`maint-categories-${buildingId}`);
        }
      }
    },
    [buildingId, categories, originalCategories],
    1000,
  );

  // return
  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalCreateCategoryOpen && (
        <ModalCreateCategory
          categories={categories}
          setModal={setModalCreateCategoryOpen}
          setCategories={setCategories}
        />
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
                  autosaveDB.remove(`maint-categories-${buildingId}`);

                  requestManageBuildingMaintenances({
                    categories,
                    buildingId: buildingId!,
                    origin: account?.origin,
                    navigate,
                    setOnQuery,
                  });
                }}
              />
            )}
          </Style.RightSide>
        </Style.HeaderWrapper>

        <Style.SearchField>
          <IconButton
            icon={<IconSearch strokeColor="primary" />}
            size="16px"
            onClick={() => setFilter(inputRef.current)}
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
    </>
  );
};
