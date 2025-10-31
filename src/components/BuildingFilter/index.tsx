import { Form, Formik } from 'formik';
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

import { FormikSelect } from '@components/Form/FormikSelect';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';

import * as Styles from './styles';

type BuildingFilterProps = {
  buildingIds: string[];
  setBuildingIds: (ids: string[]) => void;
  onApply: () => void | Promise<void>;
  disabled?: boolean;
  clearButtonLabel?: string;
  applyButtonLabel?: string;
};

export const BuildingFilter = ({
  buildingIds,
  setBuildingIds,
  onApply,
  disabled = false,
  clearButtonLabel = 'Limpar filtros',
  applyButtonLabel = 'Filtrar',
}: BuildingFilterProps) => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: false });

  return (
    <Styles.FiltersContainer>
      <Formik initialValues={{ buildings: buildingIds }} enableReinitialize onSubmit={async () => onApply()}>
        {() => (
          <Form>
            <Styles.FilterWrapper>
              <div>
                <FormikSelect
                  id="building-select"
                  label="Edificação"
                  selectPlaceholderValue={' '}
                  value=""
                  disabled={!!disabled}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected === 'all') {
                      setBuildingIds([]);
                    } else if (!buildingIds.includes(selected)) {
                      setBuildingIds([...buildingIds, selected]);
                    }
                  }}
                >
                  <option value="" disabled hidden>
                    Selecione
                  </option>
                  <option value="all" disabled={buildingIds.length === 0}>
                    Todas
                  </option>
                  {buildingsForSelect.map((building) => (
                    <option key={building.id} value={building.id} disabled={buildingIds.includes(building.id)}>
                      {building.name}
                    </option>
                  ))}
                </FormikSelect>
              </div>

              <Styles.FilterButtonWrapper>
                <Button
                  type="button"
                  label={clearButtonLabel}
                  borderless
                  textColor="primary"
                  disable={!!disabled}
                  onClick={() => {
                    setBuildingIds([]);
                    onApply();
                  }}
                />
                <Button type="submit" label={applyButtonLabel} disable={!!disabled} bgColor="primary" />
              </Styles.FilterButtonWrapper>
            </Styles.FilterWrapper>

            <Styles.FilterWrapperFooter>
              <Styles.FilterTags>
                {buildingIds.length === 0 ? (
                  <ListTag label="Todas as edificações" color="white" backgroundColor="primaryM" fontWeight={500} padding="4px 12px" />
                ) : (
                  buildingIds.map((buildingId) => {
                    const building = buildingsForSelect.find((b) => b.id === buildingId);
                    return (
                      <ListTag
                        key={buildingId}
                        label={building?.name || ''}
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                        onClick={() => setBuildingIds(buildingIds.filter((id) => id !== buildingId))}
                      />
                    );
                  })
                )}
              </Styles.FilterTags>
            </Styles.FilterWrapperFooter>
          </Form>
        )}
      </Formik>
    </Styles.FiltersContainer>
  );
};


