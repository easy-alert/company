// LIBS
import { useState } from 'react';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import IconUploadLine from '@assets/icons/IconUploadLine';
import IconX from '@assets/icons/IconX';
import { toast } from 'react-toastify';
import * as Style from './styles';
import { theme } from '../../styles/theme';
import { IconButton } from '../Buttons/IconButton';
import { Button } from '../Buttons/Button';
import { TextArea } from '../Inputs/TextArea';

export const ShareMaintenanceHistoryButton = ({
  maintenanceHistoryId,
}: {
  maintenanceHistoryId: string;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  function getArrowStyle(position: string | undefined, arrowSize: number) {
    switch (position) {
      case 'top':
        return {
          bottom: 3,
          borderTop: `${arrowSize}px solid white`,
          zIndex: 1,
        };
      case 'bottom':
        return {
          top: 3,
          borderBottom: `${arrowSize}px solid white`,
          zIndex: 1,
        };
      case 'right':
        return {
          left: 3,
          borderRight: `${arrowSize}px solid white`,
          zIndex: 1,
        };
      default:
        return {
          right: 3,
          borderLeft: `${arrowSize}px solid white`,
          zIndex: 1,
        };
    }
  }

  const togglePopOver = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const guestLink = `${
    import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001'
  }/guest-maintenance-history/${maintenanceHistoryId}`;

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom']}
      padding={1}
      onClickOutside={() => {
        setIsPopoverOpen(false);
      }}
      containerStyle={{ zIndex: '10' }}
      // eslint-disable-next-line react/no-unstable-nested-components
      content={({ position, childRect, popoverRect }) => {
        const arrowSize = 10;
        return (
          <Style.AnimationDiv>
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={theme.color.gray3}
              arrowSize={arrowSize}
            >
              <ArrowContainer
                position={position}
                childRect={childRect}
                popoverRect={popoverRect}
                arrowSize={arrowSize}
                arrowColor={theme.color.gray3}
                style={{
                  paddingLeft: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: 0,
                }}
                arrowStyle={getArrowStyle(position, arrowSize)}
              >
                <Style.PopoverBackground>
                  <Style.PopoverBody contentColor={theme.color.gray4}>
                    <h3>
                      Compartilhar manutenção
                      <IconButton
                        onClick={() => {
                          setIsPopoverOpen(false);
                        }}
                        icon={<IconX strokeColor="primary" />}
                        fill="primary"
                      />
                    </h3>
                    <Style.Hr />
                    <TextArea
                      style={{ wordBreak: 'break-all' }}
                      label="Link de compartilhamento"
                      defaultValue={guestLink}
                      readOnly
                      height="70px"
                    />
                    <Button
                      bgColor="primary"
                      style={{ marginTop: '16px' }}
                      center
                      label="Copiar link"
                      onClick={() => {
                        navigator.clipboard.writeText(guestLink);
                        toast.success('Link copiado.');
                        togglePopOver();
                      }}
                    />
                  </Style.PopoverBody>
                </Style.PopoverBackground>
              </ArrowContainer>
            </ArrowContainer>
          </Style.AnimationDiv>
        );
      }}
    >
      <Style.ButtonContainer>
        <IconButton
          icon={<IconUploadLine strokeColor="primary" />}
          fill="primary"
          onClick={togglePopOver}
        />
      </Style.ButtonContainer>
    </Popover>
  );
};
