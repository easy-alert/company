/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// LIBS
import { useState } from 'react';

// COMPONENTS
import IconDownArrow from '@assets/icons/IconDownArrow';
import { handlePriorityName } from '@utils/handlePriorityName';
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
import { ListTag } from '../../../../../../components/ListTag';

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
  maintenancePriorities,
}: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);
  const [modalAdditionalInformations, setModalAdditionalInformations] = useState<boolean>(false);
  const [modalEditMaintenanceOpen, setModalEditMaintenanceOpen] = useState<boolean>(false);
  const [modalCloneMaintenanceOpen, setModalCloneMaintenanceOpen] = useState<boolean>(false);

  const [toCloneMaintenance, setToCloneMaintenance] = useState<IMaintenance>();

  const frequency = maintenance.FrequencyTimeInterval.unitTime * maintenance.frequency;

  // periodicidade mínima de 6 meses pra antecipar
  const sixMonthsInDays = 30 * 6;

  const canAnticipate = frequency >= sixMonthsInDays;

  const maxDaysToAnticipate = frequency / 2;

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
          maintenancePriorities={maintenancePriorities}
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
          maintenancePriorities={maintenancePriorities}
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
          hasHistory={!!maintenance.hasHistory}
          canAnticipate={canAnticipate}
          maxDaysToAnticipate={maxDaysToAnticipate}
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
                id={maintenance.id}
                name={maintenance.id}
                type="checkbox"
                checked={maintenance.isSelected ?? false}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={() => {
                  if (toCopyBuilding !== '') {
                    setToCopyBuilding('');
                  }

                  setCategories((prev) => {
                    const newState = [...prev];

                    const newMaintenanceIndex = categories[categoryIndex].Maintenances.findIndex(
                      (maintenanceParam) => maintenanceParam.id === maintenance.id,
                    );

                    newState[categoryIndex].Maintenances[newMaintenanceIndex].isSelected =
                      !newState[categoryIndex].Maintenances[newMaintenanceIndex].isSelected;
                    return newState;
                  });
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
                  <Image img={<IconDownArrow strokeColor="primary" />} size="16px" fill="primary" />
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

              {maintenance?.instructions && maintenance?.instructions?.length > 0 && (
                <p className="p2 instructions">
                  <span>Instruções: </span>
                  <Style.FileRow>
                    {maintenance?.instructions?.map(({ url, name }) => (
                      <ListTag padding="4px 12px" downloadUrl={url} key={url} label={name} />
                    ))}
                  </Style.FileRow>
                </p>
              )}

              <p className="p2">
                <span>Prioridade: </span>
                {handlePriorityName(maintenance.priorityName)}
              </p>

              {/* <Style.PeriodIconWrapper title="Tempo para iniciar a notificação após a entrega da obra.">
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
              </Style.PeriodIconWrapper> */}
              {/* div pra suprir o espaço do delay */}
              <div />
              {/*  */}

              <div />
              <div />
              <div />

              <Style.MaintenancesCardGridMoreEditButton>
                <div>
                  <Button
                    bgColor="primary"
                    style={{ whiteSpace: 'nowrap' }}
                    label="+ Opções"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalAdditionalInformations(true);
                    }}
                  />
                  <Button
                    bgColor="primary"
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
                        {maintenance.nextNotificationDate}
                      </p>
                    </Style.AdditionalInformationsWrapper>
                  )}

                  {maintenance.lastResolutionDate && (
                    <Style.AdditionalInformationsWrapper>
                      <p className="p2">
                        <span>Última conclusão: </span>
                        {maintenance.lastResolutionDate}
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

              {!!maintenance.daysToAnticipate && (
                <Style.DaysToAncitipateWrapper>
                  <p className="p2">
                    <span>Dias para antecipar: </span>
                    {maintenance.daysToAnticipate}
                  </p>
                </Style.DaysToAncitipateWrapper>
              )}
            </Style.MaintenancesMoreGrid>
          </Style.MaintenancesCardBottomContainer>
        </Style.MaintenancesCardContent>
      </Style.MaintenancesCard>
    </>
  );
};
