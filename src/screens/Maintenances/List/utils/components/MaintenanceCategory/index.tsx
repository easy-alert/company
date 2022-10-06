/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */

// LIBS
import { useState } from 'react';
import { icon } from '../../../../../../assets/icons';

// COMPONENTS
import * as Style from './styles';
import { IconButton } from '../../../../../../components/Buttons/IconButton';
import { Image } from '../../../../../../components/Image';
import { MaintenanceCard } from '../MaintenanceCard';

// MODALS
import { ModalCreateMaintenance } from './utils/ModalCreateMaintenance';
import { ModalEditCategory } from './utils/ModalEditCategory';

// FUNCTIONS
import { alphabeticalOrder, nestedObjectAlphabeticalOrder } from './utils/functions';

// TYPES
import { IMaintenanceCategory, ISortType } from './utils/types';

export const MaintenanceCategory = ({
  category,
  categories,
  setCategories,
  timeIntervals,
}: IMaintenanceCategory) => {
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [sortType, setSortType] = useState<ISortType>({ type: 'element' });
  const [modalCreateMaintenanceOpen, setModalCreateMaintenanceOpen] = useState<boolean>(false);
  const [modalEditCategoryOpen, setModalEditCategoryOpen] = useState<boolean>(false);

  return (
    <>
      {modalCreateMaintenanceOpen && (
        <ModalCreateMaintenance
          setModal={setModalCreateMaintenanceOpen}
          categoryId={category.id}
          categories={categories}
          setCategories={setCategories}
          timeIntervals={timeIntervals}
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
              <h5>{category.name}</h5>
              <IconButton
                size="16px"
                icon={icon.edit}
                onClick={() => {
                  setModalEditCategoryOpen(true);
                }}
              />
            </Style.Container>

            <IconButton
              hideLabelOnMedia
              icon={icon.plus}
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
                <p
                  className="p2"
                  style={{
                    opacity: sortType.type === 'element' ? '1' : '0.5',
                  }}
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
                  Elemento
                  {(isSorted && sortType.type === 'element') || sortType.type !== 'element' ? (
                    <Image img={icon.upTriangle} size="8px" />
                  ) : (
                    <Image img={icon.downTriangle} size="8px" />
                  )}
                </p>
                <p
                  className="p2"
                  style={{
                    opacity: sortType.type === 'activity' ? '1' : '0.5',
                  }}
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
                  Atividade
                  {isSorted && sortType.type === 'activity' ? (
                    <Image img={icon.downTriangle} size="8px" />
                  ) : (
                    <Image img={icon.upTriangle} size="8px" />
                  )}
                </p>
                <p
                  className="p2"
                  style={{
                    opacity: sortType.type === 'frequency' ? '1' : '0.5',
                  }}
                  onClick={() => {
                    setSortType({ type: 'frequency' });
                    nestedObjectAlphabeticalOrder({
                      category,
                      isSorted,
                      setIsSorted,
                      toSortString: 'singularLabel',
                      toSortObject: 'FrequencyTimeInterval',
                    });
                  }}
                >
                  Frequência
                  {isSorted && sortType.type === 'frequency' ? (
                    <Image img={icon.downTriangle} size="8px" />
                  ) : (
                    <Image img={icon.upTriangle} size="8px" />
                  )}
                </p>
                <p
                  className="p2"
                  style={{
                    opacity: sortType.type === 'responsible' ? '1' : '0.5',
                  }}
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
                  Responsável
                  {isSorted && sortType.type === 'responsible' ? (
                    <Image img={icon.downTriangle} size="8px" />
                  ) : (
                    <Image img={icon.upTriangle} size="8px" />
                  )}
                </p>
                <p
                  className="p2"
                  style={{
                    opacity: sortType.type === 'source' ? '1' : '0.5',
                  }}
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
                  Fonte
                  {isSorted && sortType.type === 'source' ? (
                    <Image img={icon.downTriangle} size="8px" />
                  ) : (
                    <Image img={icon.upTriangle} size="8px" />
                  )}
                </p>
              </Style.MaintenancesGrid>
            </Style.MaintenancesHeader>
          ) : (
            <p className="p2" style={{ opacity: 0.7 }}>
              Nenhuma manutenção cadastrada.
            </p>
          )}

          {category.Maintenances.map((maintenance) => (
            <MaintenanceCard
              maintenance={maintenance}
              key={maintenance.id}
              timeIntervals={timeIntervals}
              categories={categories}
              setCategories={setCategories}
              categoryId={category.id}
            />
          ))}
        </Style.MaintenancesContainer>
      </Style.Background>
    </>
  );
};
