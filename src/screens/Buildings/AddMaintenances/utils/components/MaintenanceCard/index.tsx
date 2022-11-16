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

// MODALS

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
            <p className="p2">
              <span>Observação: </span>
              {maintenance.observation ?? 'Nenhuma observação'}
            </p>

            <Style.MaintenancesCardBottomPeriod>
              <Style.PeriodIconWrapper>
                <Image img={icon.alert} size="16px" />
                <p className="p2">
                  <span>Tempo para resposta: </span>
                  {`${maintenance.period} ${
                    maintenance.period > 1
                      ? maintenance.PeriodTimeInterval.pluralLabel
                      : maintenance.PeriodTimeInterval.singularLabel
                  }`}
                </p>
              </Style.PeriodIconWrapper>
              <Style.PeriodIconWrapper>
                <Image img={icon.alert} size="16px" />
                <p className="p2">
                  <span>Delay: </span>
                  {`${maintenance.delay} ${
                    maintenance.delay > 1
                      ? maintenance.DelayTimeInterval.pluralLabel
                      : maintenance.DelayTimeInterval.singularLabel
                  }`}
                </p>
              </Style.PeriodIconWrapper>
            </Style.MaintenancesCardBottomPeriod>
          </Style.MaintenancesMoreGrid>
        </Style.MaintenancesCardBottomContainer>
      </Style.MaintenancesCardContent>
    </Style.MaintenancesCard>
  );
};
