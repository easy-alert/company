// LIBS
import { useState } from 'react';

// COMPONENTS
import { icon } from '../../../../../../assets/icons';
import { Button } from '../../../../../../components/Buttons/Button';
import { Image } from '../../../../../../components/Image';
import * as Style from './styles';

// TYPES
import { IMaintenanceCard } from './utils/types';

// MODALS
import { ModalEditMaintenance } from './utils/ModalEditMaintenance';

export const MaintenanceCard = ({
  maintenance,
  timeIntervals,
  categories,
  setCategories,
  categoryId,
}: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);
  const [modalEditMaintenanceOpen, setModalEditMaintenanceOpen] = useState<boolean>(false);

  return (
    <>
      {modalEditMaintenanceOpen && (
        <ModalEditMaintenance
          setModal={setModalEditMaintenanceOpen}
          selectedMaintenance={maintenance}
          timeIntervals={timeIntervals}
          categories={categories}
          setCategories={setCategories}
          categoryId={categoryId}
        />
      )}
      <Style.MaintenancesCard
        onClick={() => {
          setCardIsOpen((prevState) => !prevState);
        }}
      >
        <Style.MaintenancesCardContent>
          <Style.MaintenancesCardTopContent>
            <Style.MaintenancesGrid cardIsOpen={cardIsOpen}>
              <p className="p2">{maintenance.MaintenancesHistory[0].element}</p>
              <p className="p2">{maintenance.MaintenancesHistory[0].activity}</p>
              <p className="p2">
                A cada{' '}
                {`${maintenance.MaintenancesHistory[0].frequency} ${
                  maintenance.MaintenancesHistory[0].frequency > 1
                    ? maintenance.MaintenancesHistory[0].FrequencyTimeInterval.pluralLabel
                    : maintenance.MaintenancesHistory[0].FrequencyTimeInterval.singularLabel
                }`}
              </p>
              <p className="p2">{maintenance.MaintenancesHistory[0].responsible}</p>
              <p className="p2">{maintenance.MaintenancesHistory[0].source}</p>
              <Style.ArrowContainer>
                <Style.Arrow cardIsOpen={cardIsOpen}>
                  <Image img={icon.downArrow} size="16px" />
                </Style.Arrow>
              </Style.ArrowContainer>
            </Style.MaintenancesGrid>
          </Style.MaintenancesCardTopContent>

          <Style.MaintenancesCardBottomContainer cardIsOpen={cardIsOpen}>
            <Style.Hr />
            <Style.MaintenancesMoreGrid>
              <p className="p2">
                <span>Observação: </span>
                {maintenance.MaintenancesHistory[0].observation ?? 'Nenhuma observação'}
              </p>

              <Style.MaintenancesCardBottomPeriod>
                <Style.PeriodIconWrapper>
                  <Image img={icon.alert} size="16px" />
                  <p className="p2">
                    <span>Período: </span>
                    {`${maintenance.MaintenancesHistory[0].period} ${
                      maintenance.MaintenancesHistory[0].period > 1
                        ? maintenance.MaintenancesHistory[0].PeriodTimeInterval.pluralLabel
                        : maintenance.MaintenancesHistory[0].PeriodTimeInterval.singularLabel
                    }`}
                  </p>
                </Style.PeriodIconWrapper>
                <Style.PeriodIconWrapper>
                  <Image img={icon.alert} size="16px" />
                  <p className="p2">
                    <span>Delay: </span>
                    {`${maintenance.MaintenancesHistory[0].delay} ${
                      maintenance.MaintenancesHistory[0].delay > 1
                        ? maintenance.MaintenancesHistory[0].DelayTimeInterval.pluralLabel
                        : maintenance.MaintenancesHistory[0].DelayTimeInterval.singularLabel
                    }`}
                  </p>
                </Style.PeriodIconWrapper>
              </Style.MaintenancesCardBottomPeriod>
              <Style.MaintenancesCardGridMoreEditButton>
                <Button
                  label="Editar"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalEditMaintenanceOpen(true);
                  }}
                />
              </Style.MaintenancesCardGridMoreEditButton>
            </Style.MaintenancesMoreGrid>
          </Style.MaintenancesCardBottomContainer>
        </Style.MaintenancesCardContent>
      </Style.MaintenancesCard>
    </>
  );
};
