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

// FUNCTIONS
import { requestCategories } from './utils/functions';

// MODALS

export const BuildingMaintenancesList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [categories, setCategories] = useState<ICategories[]>([]);

  // MODALS

  useEffect(() => {
    requestCategories({ setLoading, setCategories });
  }, []);

  return loading ? (
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
      </Style.Header>

      {categories?.length ? (
        <Style.CategoriesContainer>
          {categories.map((category) => (
            <MaintenanceCategory key={category.id} category={category} />
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
