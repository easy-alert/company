/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// LIBS
import { useState } from 'react';

// COMPONENTS
import { icon } from '../../../../../../assets/icons';
import { Button } from '../../../../../../components/Buttons/Button';
import { Image } from '../../../../../../components/Image';
import * as Style from './styles';
import { ModalAdditionalInformations } from './ModalAdditionalInformations';

// TYPES
import { IMaintenanceCard } from './types';
import { dateFormatter } from '../../../../../../utils/functions';

export const MaintenanceCard = ({
  maintenance,
  categories,
  setCategories,
  categoryIndex,
  maintenanceIndex,
  setToCopyBuilding,
  toCopyBuilding,
}: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);
  const [modalAdditionalInformations, setModalAdditionalInformations] = useState<boolean>(false);

  return (
    <>
      {modalAdditionalInformations && (
        <ModalAdditionalInformations
          setModal={setModalAdditionalInformations}
          setCategories={setCategories}
          categoryIndex={categoryIndex}
          maintenanceIndex={maintenanceIndex}
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
              <input
                type="checkbox"
                checked={maintenance.isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={() => {
                  if (toCopyBuilding !== '') {
                    setToCopyBuilding('');
                  }

                  const updatedCategories = categories;

                  updatedCategories[categoryIndex].Maintenances[maintenanceIndex].isSelected =
                    !maintenance.isSelected;

                  setCategories([...updatedCategories]);
                }}
              />
              <p className="p2">{maintenance.element}</p>
              <p className="p2">{maintenance.activity}</p>
              <p className="p2">
                A cada{' '}
                {`${maintenance.frequency} ${
                  maintenance.frequency > 1
                    ? maintenance.FrequencyTimeInterval.pluralLabel
                    : maintenance.FrequencyTimeInterval.singularLabel
                }`}
              </p>
              <p className="p2">{maintenance.responsible}</p>
              <p className="p2">{maintenance.source}</p>

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
              <div />

              <p className="p2">
                <span>Observação: </span>
                {maintenance.observation ?? '-'}
              </p>
              <p className="p2">
                <span>Prazo para execução: </span>
                {`${maintenance.period} ${
                  maintenance.period > 1
                    ? maintenance.PeriodTimeInterval.pluralLabel
                    : maintenance.PeriodTimeInterval.singularLabel
                }`}
              </p>
              <Style.PeriodIconWrapper title="Tempo para iniciar a notificação após a entrega da obra.">
                <Image img={icon.alert} size="16px" />
                <p className="p2">
                  <span>Delay: </span>
                  {maintenance.delay > 0
                    ? `${maintenance.delay} ${
                        maintenance.delay > 1
                          ? maintenance.DelayTimeInterval.pluralLabel
                          : maintenance.DelayTimeInterval.singularLabel
                      }`
                    : '-'}
                </p>
              </Style.PeriodIconWrapper>
              <div />
              <Style.MaintenancesCardGridMoreOptionsButton>
                <Button
                  style={{ whiteSpace: 'nowrap' }}
                  label="+ Opções"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalAdditionalInformations(true);
                  }}
                />
              </Style.MaintenancesCardGridMoreOptionsButton>
              <div />
              <Style.MaintenancesCardGridMoreEditButton>
                <Button label="Editar" />
              </Style.MaintenancesCardGridMoreEditButton>
              <div />
              <div />
              {maintenance.lastResolutionDate && (
                <Style.AdditionalInformationsWrapper>
                  <p className="p2">
                    <span>Última conclusão: </span>
                    {dateFormatter(maintenance.lastResolutionDate)}
                  </p>
                </Style.AdditionalInformationsWrapper>
              )}
              {maintenance.firstNotificationDate && (
                <Style.AdditionalInformationsWrapper>
                  <p className="p2">
                    <span>Primeira notificação: </span>
                    {dateFormatter(maintenance.firstNotificationDate)}
                  </p>
                </Style.AdditionalInformationsWrapper>
              )}
            </Style.MaintenancesMoreGrid>
          </Style.MaintenancesCardBottomContainer>
        </Style.MaintenancesCardContent>
      </Style.MaintenancesCard>
    </>
  );
};
