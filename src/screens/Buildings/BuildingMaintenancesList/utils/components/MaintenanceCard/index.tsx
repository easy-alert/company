// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Image } from '@components/Image';
import { ListTag } from '@components/ListTag';
import { ImageComponent } from '@components/ImageComponent';

// GLOBAL UTILS
import { capitalizeFirstLetter } from '@utils/functions';
import { handlePriorityName } from '@utils/handlePriorityName';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconDownArrow from '@assets/icons/IconDownArrow';
import IconInfo from '@assets/icons/IconInfo';

// STYLES
import * as Style from './styles';

// TYPES
import type { IMaintenanceCard } from './utils/types';

export const MaintenanceCard = ({
  maintenance,
  handleSelectedMaintenance,
  handleModals,
}: IMaintenanceCard) => {
  const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);

  return (
    <Style.MaintenancesCard>
      <Style.MaintenancesCardContent>
        <Style.MaintenancesCardAdditionalContent minHeight="10px" justifyContent="flex-end">
          {maintenance.Maintenance.MaintenanceAdditionalInformation?.information && (
            <IconInfo strokeColor="actionBlue" />
          )}
        </Style.MaintenancesCardAdditionalContent>

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

            <Style.ArrowContainer onClick={() => setCardIsOpen(!cardIsOpen)}>
              <Style.Arrow cardIsOpen={cardIsOpen}>
                <Image img={<IconDownArrow strokeColor="primary" />} size="16px" />
              </Style.Arrow>
            </Style.ArrowContainer>
          </Style.MaintenancesGrid>
        </Style.MaintenancesCardTopContent>

        <Style.MaintenancesCardAdditionalContent minHeight="20px" justifyContent="flex-start">
          <Style.MaintenancesGrid cardIsOpen={cardIsOpen}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {maintenance.Maintenance.MaintenanceAdditionalInformation?.user && (
                <ImageComponent
                  key={maintenance.Maintenance.MaintenanceAdditionalInformation?.user?.id}
                  size="20px"
                  radius="50%"
                  src={
                    maintenance.Maintenance.MaintenanceAdditionalInformation?.user?.image ||
                    icon.personPlaceholder
                  }
                  alt={
                    maintenance.Maintenance.MaintenanceAdditionalInformation?.user?.name ||
                    'Usuário sem imagem'
                  }
                />
              )}
            </div>
          </Style.MaintenancesGrid>
        </Style.MaintenancesCardAdditionalContent>

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

            {maintenance?.Maintenance.instructions &&
              maintenance?.Maintenance.instructions?.length > 0 && (
                <p className="p2 instructions">
                  <span>Instruções: </span>
                  <Style.FileRow>
                    {maintenance?.Maintenance.instructions?.map(({ url, name }) => (
                      <ListTag padding="4px 12px" downloadUrl={url} key={url} label={name} />
                    ))}
                  </Style.FileRow>
                </p>
              )}

            {/* div pra suprir o espaço do delay */}

            <div />
            {/*  */}
            <div />
            <div />
            <div />

            <p className="p2">
              <span>Prioridade: </span>
              {handlePriorityName(maintenance.Maintenance.priorityName)}
            </p>

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

            <div />

            <Style.AdditionalInformationsWrapper>
              <Button
                bgColor="primary"
                label="Informações adicionais"
                onClick={() => {
                  handleSelectedMaintenance({
                    maintenanceId: maintenance.Maintenance.id,
                    userResponsible: maintenance.Maintenance.MaintenanceAdditionalInformation?.user,
                    additionalInformation:
                      maintenance.Maintenance.MaintenanceAdditionalInformation?.information || '',
                  });
                  handleModals({ modal: 'additionalInformation', modalState: true });
                }}
              />
            </Style.AdditionalInformationsWrapper>

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

            <div />
            <div />
            <div />
          </Style.MaintenancesMoreGrid>
        </Style.MaintenancesCardBottomContainer>
      </Style.MaintenancesCardContent>
    </Style.MaintenancesCard>
  );
};
