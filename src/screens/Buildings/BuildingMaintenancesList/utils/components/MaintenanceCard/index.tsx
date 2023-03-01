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
              {maintenance.Maintenance.observation ?? '-'}
            </p>

            <Style.PeriodIconWrapper>
              <Image img={icon.alert} size="16px" />
              <p className="p2">
                <span>Prazo para execução: </span>
                {`${maintenance.Maintenance.period} ${
                  maintenance.Maintenance.period > 1
                    ? maintenance.Maintenance.PeriodTimeInterval.pluralLabel
                    : maintenance.Maintenance.PeriodTimeInterval.singularLabel
                }`}
              </p>
            </Style.PeriodIconWrapper>
            <Style.PeriodIconWrapper>
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
            <div style={{ height: '32px' }} />
          </Style.MaintenancesMoreGrid>
        </Style.MaintenancesCardBottomContainer>
      </Style.MaintenancesCardContent>
    </Style.MaintenancesCard>
  );
};
