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
import { ModalEditMaintenance } from '../../../../../Maintenances/List/utils/components/MaintenanceCard/utils/ModalEditMaintenance';

// TYPES
import { IMaintenanceCard } from './types';
import { capitalizeFirstLetter, dateFormatter } from '../../../../../../utils/functions';
import { IMaintenance } from '../../types';
import { ModalCloneMaintenance } from '../../../../../Maintenances/List/utils/components/MaintenanceCard/utils/ModalCloneMaintenance';
import { IconButton } from '../../../../../../components/Buttons/IconButton';

export const MaintenanceCard = ({
  maintenance,
  categories,
  setCategories,
  categoryIndex,
  maintenanceIndex,
  setToCopyBuilding,
  toCopyBuilding,
  categoryId,
  timeIntervals,
  categoriesOptions,
}: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);
  const [modalAdditionalInformations, setModalAdditionalInformations] = useState<boolean>(false);
  const [modalEditMaintenanceOpen, setModalEditMaintenanceOpen] = useState<boolean>(false);
  const [modalCloneMaintenanceOpen, setModalCloneMaintenanceOpen] = useState<boolean>(false);

  const [toCloneMaintenance, setToCloneMaintenance] = useState<IMaintenance>();

  return (
    <>
      {modalEditMaintenanceOpen && (
        <ModalEditMaintenance
          setModal={setModalEditMaintenanceOpen}
          selectedMaintenance={maintenance}
          timeIntervals={timeIntervals}
          categories={categories}
          categoryId={categoryId}
          setCategories={setCategories}
        />
      )}
      {modalCloneMaintenanceOpen && toCloneMaintenance && (
        <ModalCloneMaintenance
          setModal={setModalCloneMaintenanceOpen}
          categoryId={categoryId}
          categories={categories}
          setCategories={setCategories}
          timeIntervals={timeIntervals}
          maintenance={toCloneMaintenance}
          categoriesOptions={categoriesOptions}
        />
      )}
      {modalAdditionalInformations && (
        <ModalAdditionalInformations
          setModal={setModalAdditionalInformations}
          setCategories={setCategories}
          categories={categories}
          categoryIndex={categoryIndex}
          maintenanceIndex={maintenanceIndex}
          selectedMaintenance={maintenance}
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
                checked={maintenance.isSelected ?? false}
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

              <div
                className="copyIcon"
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
              >
                <IconButton
                  icon={icon.copy}
                  size="16px"
                  onClick={() => {
                    setToCloneMaintenance(maintenance);
                    setModalCloneMaintenanceOpen(true);
                  }}
                />
              </div>
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
                {maintenance.observation && maintenance.observation !== ''
                  ? maintenance.observation
                  : '-'}
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
              <div />
              <div />

              <Style.MaintenancesCardGridMoreEditButton>
                <div>
                  <Button
                    disable={maintenance.hasHistory}
                    style={{ whiteSpace: 'nowrap' }}
                    label="+ Opções"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalAdditionalInformations(true);
                    }}
                  />
                  <Button
                    disable={!maintenance.ownerCompanyId}
                    label="Editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalEditMaintenanceOpen(true);
                    }}
                  />
                </div>
              </Style.MaintenancesCardGridMoreEditButton>
              <div />
              <div />

              {maintenance.hasHistory && (
                <>
                  {maintenance.nextNotificationDate && (
                    <Style.AdditionalInformationsWrapper>
                      <p className="p2">
                        <span>Próxima notificação: </span>
                        {dateFormatter(maintenance.nextNotificationDate)}
                      </p>
                    </Style.AdditionalInformationsWrapper>
                  )}

                  {maintenance.lastResolutionDate && (
                    <Style.AdditionalInformationsWrapper>
                      <p className="p2">
                        <span>Última conclusão: </span>
                        {dateFormatter(maintenance.lastResolutionDate)}
                      </p>
                    </Style.AdditionalInformationsWrapper>
                  )}

                  {maintenance.lastNotificationDate && (
                    <Style.LastNotificationDate
                      title={capitalizeFirstLetter(maintenance.lastNotificationStatus || '')}
                    >
                      <Image img={icon.yellowAlert} size="16px" />
                      <p className="p2">
                        <span>Última notificação: </span>
                        {maintenance.lastNotificationDate}
                      </p>
                    </Style.LastNotificationDate>
                  )}
                </>
              )}

              {maintenance.notificationDate && (
                <Style.AdditionalInformationsWrapper>
                  <p className="p2">
                    <span>Próxima notificação: </span>
                    {dateFormatter(maintenance.notificationDate.toString())}
                  </p>
                </Style.AdditionalInformationsWrapper>
              )}

              {maintenance.resolutionDate && (
                <Style.AdditionalInformationsWrapper>
                  <p className="p2">
                    <span>Última conclusão: </span>
                    {dateFormatter(maintenance.resolutionDate.toString())}
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
