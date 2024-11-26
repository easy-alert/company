// LIBS
import { ArrowContainer } from 'react-tiny-popover';
import type { PopoverPosition } from 'react-tiny-popover';
import { toast } from 'react-toastify';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { TextArea } from '@components/Inputs/TextArea';

// GLOBAL THEMES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// STYLES
import * as Style from '../styles';

interface IShareButton {
  ticketId: string;
  position: PopoverPosition | undefined;
  childRect: any;
  popoverRect: any;
  arrowSize: number;
  handleTogglePopover: any;
}

export const ShareButton = ({
  ticketId,
  position,
  childRect,
  popoverRect,
  arrowSize,
  handleTogglePopover,
}: IShareButton) => {
  const guestLink = `${
    import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001'
  }/guest-ticket/${ticketId}`;

  function getArrowStyle() {
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink);
    toast.success('Link copiado.');
    handleTogglePopover();
  };

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
          arrowStyle={getArrowStyle()}
        >
          <Style.PopoverBackground>
            <Style.PopoverBody contentColor={theme.color.gray4}>
              <h3>
                Compartilhar manutenção
                <IconButton onClick={() => handleTogglePopover(false)} icon={icon.x} />
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
                style={{ marginTop: '16px' }}
                center
                label="Copiar link"
                onClick={handleCopyLink}
              />
            </Style.PopoverBody>
          </Style.PopoverBackground>
        </ArrowContainer>
      </ArrowContainer>
    </Style.AnimationDiv>
  );
};
