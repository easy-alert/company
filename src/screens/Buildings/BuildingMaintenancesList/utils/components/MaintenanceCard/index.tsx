/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// LIBS
import { useState } from 'react';

// COMPONENTS
import { icon } from '../../../../../../assets/icons';
import { Image } from '../../../../../../components/Image';
import * as Style from './styles';

// TYPES
import { IMaintenanceCard } from './utils/types';
import { capitalizeFirstLetter } from '../../../../../../utils/functions';

export const MaintenanceCard = ({ maintenance }: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);

  return (
    <Style.MaintenancesCard
      onClick={() => {
        setCardIsOpen((prevState) => !prevState);
      }}
    >
      <Style.MaintenancesCardContent>
        <Style.MaintenancesCardTopContent>
          <Style.MaintenancesGrid cardIsOpen={cardIsOpen}>
            <p className="p2">{maintenance.Maintenance.element}</p>
            <p className="p2">{maintenance.Maintenance.activity}</p>
            <p className="p2">
              A cada{' '}
              {`${maintenance.Maintenance.frequency} ${
                maintenance.Maintenance.frequency > 1
                  ? maintenance.Maintenance.FrequencyTimeInterval.pluralLabel
                  : maintenance.Maintenance.FrequencyTimeInterval.singularLabel
              }`}
            </p>
            <p className="p2">{maintenance.Maintenance.responsible}</p>
            <p className="p2">{maintenance.Maintenance.source}</p>

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
              {maintenance.Maintenance.observation && maintenance.Maintenance.observation !== ''
                ? maintenance.Maintenance.observation
                : '-'}
            </p>

            <p className="p2">
              <span>Prazo para execução: </span>
              {`${maintenance.Maintenance.period} ${
                maintenance.Maintenance.period > 1
                  ? maintenance.Maintenance.PeriodTimeInterval.pluralLabel
                  : maintenance.Maintenance.PeriodTimeInterval.singularLabel
              }`}
            </p>

            <Style.PeriodIconWrapper title="Tempo para iniciar a notificação após a entrega da obra.">
              <Image img={icon.alert} size="16px" />
              <p className="p2">
                <span>Delay: </span>
                {maintenance.Maintenance.delay > 0
                  ? `${maintenance.Maintenance.delay} ${
                      maintenance.Maintenance.delay > 1
                        ? maintenance.Maintenance.DelayTimeInterval.pluralLabel
                        : maintenance.Maintenance.DelayTimeInterval.singularLabel
                    }`
                  : '-'}
              </p>
            </Style.PeriodIconWrapper>
            <div />
            <div />
            <div />

            {maintenance.Maintenance.nextNotificationDate && (
              <Style.AdditionalInformationsWrapper>
                <p className="p2">
                  <span>Próxima notificação: </span>
                  {maintenance.Maintenance.nextNotificationDate}
                </p>
              </Style.AdditionalInformationsWrapper>
            )}

            {maintenance.Maintenance.lastResolutionDate && (
              <Style.AdditionalInformationsWrapper>
                <p className="p2">
                  <span>Última conclusão: </span>
                  {maintenance.Maintenance.lastResolutionDate}
                </p>
              </Style.AdditionalInformationsWrapper>
            )}

            {maintenance.Maintenance.lastNotificationDate && (
              <Style.LastNotificationDate
                title={capitalizeFirstLetter(maintenance.Maintenance.lastNotificationStatus || '')}
              >
                <Image img={icon.yellowAlert} size="16px" />
                <p className="p2">
                  <span>Última notificação: </span>
                  {maintenance.Maintenance.lastNotificationDate}
                </p>
              </Style.LastNotificationDate>
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
  );
};
