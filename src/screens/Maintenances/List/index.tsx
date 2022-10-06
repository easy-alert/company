/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import * as Style from './styles';
import { IconButton } from '../../../components/Buttons/IconButton';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons/index';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { MaintenanceCategory } from './utils/components/MaintenanceCategory';

// TYPES
import { ICategories } from './utils/types';
import { ITimeInterval } from '../../../utils/types';

// FUNCTIONS
import { requestCategories } from './utils/functions';
import { requestListIntervals } from '../../../utils/functions';

// MODALS
import { ModalCreateCategory } from './utils/ModalCreateCategory';

export const MaintenancesList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);

  // MODALS
  const [modalCreateCategoryOpen, setModalCreateCategoryOpen] = useState<boolean>(false);

  useEffect(() => {
    requestListIntervals({ setTimeIntervals });
    requestCategories({ setLoading, setCategories });
  }, []);

  return (
    <>
      {modalCreateCategoryOpen && (
        <ModalCreateCategory
          setModal={setModalCreateCategoryOpen}
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {loading ? (
        <DotSpinLoading />
      ) : (
        <>
          <Style.Header>
            <Style.LeftSide>
              <Style.HeaderTitle>
                <h2>Manutenções</h2>
                <Style.SearchField>
                  <IconButton
                    icon={icon.search}
                    size="16px"
                    onClick={() => {
                      requestCategories({ setCategories, filter });
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
                        requestCategories({ setCategories, filter: '' });
                      }
                    }}
                    onKeyUp={(evt) => {
                      if (evt.key === 'Enter') {
                        requestCategories({ setCategories, filter });
                      }
                    }}
                  />
                </Style.SearchField>
              </Style.HeaderTitle>
            </Style.LeftSide>

            <Style.RightSide>
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
            </Style.RightSide>
          </Style.Header>

          {categories?.length ? (
            <Style.CategoriesContainer>
              {categories.map((category, i: number) => (
                <MaintenanceCategory
                  // eslint-disable-next-line react/no-array-index-key
                  key={category.name + i}
                  category={category}
                  setCategories={setCategories}
                  categories={categories}
                  timeIntervals={timeIntervals}
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
      )}
    </>
  );
};
