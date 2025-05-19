/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */

import { useEffect, useState } from 'react';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import IconEdit from '@assets/icons/IconEdit';
import { icon } from '@assets/icons';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';

// COMPONENTS
import * as Style from './styles';
import { MaintenanceCard } from '../MaintenanceCard';
import { ModalCreateMaintenance } from '../../../../../Maintenances/List/utils/components/MaintenanceCategory/utils/ModalCreateMaintenance';
import { ModalEditCategory } from '../../../../../Maintenances/List/utils/components/MaintenanceCategory/utils/ModalEditCategory';

// UTILS
import { alphabeticalOrder, numericalOrder } from './utils/functions';

// TYPES
import { IMaintenanceCategory, ISortType } from './utils/types';

export const MaintenanceCategory = ({
  category,
  categories,
  setCategories,
  categoryIndex,
  toCopyBuilding,
  setToCopyBuilding,
  timeIntervals,
  categoriesOptions,
  maintenancePriorities,
}: IMaintenanceCategory) => {
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [sortType, setSortType] = useState<ISortType>({ type: 'element' });
  const [modalCreateMaintenanceOpen, setModalCreateMaintenanceOpen] = useState<boolean>(false);
  const [modalEditCategoryOpen, setModalEditCategoryOpen] = useState<boolean>(false);

  const isAllMaintenancesSelected = category.Maintenances.every((e) => e.isSelected === true);

  useEffect(() => {
    const selectedIds = category.Maintenances.filter((m) => m.isSelected).map((m) => m.id);

    localStorage.setItem(`selected-maintenance-${category.id}`, JSON.stringify(selectedIds));
  }, [category]);

  return (
    <>
      {modalCreateMaintenanceOpen && (
        <ModalCreateMaintenance
          setModal={setModalCreateMaintenanceOpen}
          categoryId={category.id}
          categories={categories}
          setCategories={setCategories}
          timeIntervals={timeIntervals}
          categoriesOptions={categoriesOptions}
        />
      )}

      {modalEditCategoryOpen && (
        <ModalEditCategory
          setModal={setModalEditCategoryOpen}
          categoryId={category.id}
          categoryName={category.name}
          categories={categories}
          setCategories={setCategories}
        />
      )}

      <Style.Background>
        <Style.HeaderCategory>
          <Style.HeaderTitle>
            <Style.Container>
              <input
                type="checkbox"
                checked={isAllMaintenancesSelected && !!category.Maintenances.length}
                onChange={() => {
                  if (toCopyBuilding !== '') {
                    setToCopyBuilding('');
                  }

                  const updatedCategories = categories;

                  if (isAllMaintenancesSelected) {
                    for (
                      let index = 0;
                      index < updatedCategories[categoryIndex].Maintenances.length;
                      index += 1
                    ) {
                      updatedCategories[categoryIndex].Maintenances[index].isSelected = false;
                    }
                  } else {
                    for (
                      let index = 0;
                      index < updatedCategories[categoryIndex].Maintenances.length;
                      index += 1
                    ) {
                      updatedCategories[categoryIndex].Maintenances[index].isSelected = true;
                    }
                  }

                  setCategories([...updatedCategories]);
                }}
              />
              <h5>{category.name}</h5>
              <IconButton
                size="16px"
                icon={<IconEdit strokeColor="primary" />}
                fill="primary"
                onClick={() => {
                  setModalEditCategoryOpen(true);
                }}
                disabled={!category.ownerCompanyId}
              />
            </Style.Container>
            <IconButton
              hideLabelOnMedia
              fill="primary"
              icon={<IconPlus strokeColor="primary" />}
              size="16px"
              label="Criar manutenção"
              onClick={() => {
                setModalCreateMaintenanceOpen(true);
              }}
            />
          </Style.HeaderTitle>
        </Style.HeaderCategory>

        <Style.MaintenancesContainer>
          {category.Maintenances.length ? (
            <Style.MaintenancesHeader>
              <Style.MaintenancesGrid>
                <div />
                <Style.SortHeader
                  highlighted={sortType.type === 'element'}
                  onClick={() => {
                    setSortType({ type: 'element' });
                    alphabeticalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'element',
                      defaultSortedColumn: true,
                    });
                  }}
                >
                  <p className="p2">Elemento</p>
                  <Image
                    img={
                      (isSorted && sortType.type === 'element') || sortType.type !== 'element'
                        ? icon.upTriangle
                        : icon.downTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'activity'}
                  onClick={() => {
                    setSortType({ type: 'activity' });
                    alphabeticalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'activity',
                    });
                  }}
                >
                  <p className="p2">Atividade</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'activity' ? icon.downTriangle : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>
                <Style.SortHeader
                  highlighted={sortType.type === 'frequency'}
                  onClick={() => {
                    setSortType({ type: 'frequency' });
                    numericalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'frequency',
                    });
                  }}
                >
                  <p className="p2">Periodicidade</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'frequency'
                        ? icon.downTriangle
                        : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'responsible'}
                  onClick={() => {
                    setSortType({ type: 'responsible' });
                    alphabeticalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'responsible',
                    });
                  }}
                >
                  <p className="p2">Responsável</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'responsible'
                        ? icon.downTriangle
                        : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'source'}
                  onClick={() => {
                    setSortType({ type: 'source' });
                    alphabeticalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'source',
                    });
                  }}
                >
                  <p className="p2">Fonte</p>
                  <Image
                    img={
                      isSorted && sortType.type === 'source' ? icon.downTriangle : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>
              </Style.MaintenancesGrid>
            </Style.MaintenancesHeader>
          ) : (
            <p className="p2" style={{ opacity: 0.7 }}>
              Nenhuma manutenção cadastrada.
            </p>
          )}

          {category.Maintenances.map((maintenance, maintenanceIndex: number) => (
            <MaintenanceCard
              maintenance={maintenance}
              key={maintenance.id}
              categories={categories}
              categoryId={category.id}
              setCategories={setCategories}
              categoryIndex={categoryIndex}
              maintenanceIndex={maintenanceIndex}
              setToCopyBuilding={setToCopyBuilding}
              toCopyBuilding={toCopyBuilding}
              timeIntervals={timeIntervals}
              categoriesOptions={categoriesOptions}
              maintenancePriorities={maintenancePriorities}
            />
          ))}
        </Style.MaintenancesContainer>
      </Style.Background>
    </>
  );
};
