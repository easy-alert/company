// LIBS
import { ArrowContainer } from 'react-tiny-popover';
import type { PopoverPosition } from 'react-tiny-popover';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';

// GLOBAL THEMES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// STYLES
import * as Style from '../styles';

interface IShowResidentButton {
  position: PopoverPosition | undefined;
  childRect: any;
  popoverRect: any;
  arrowSize: number;
  showToResident: boolean;
  handleToggleShowToResident: () => void;
  handleTogglePopover: (popover: boolean) => void;
}

export const ShowResidentButton = ({
  position,
  childRect,
  popoverRect,
  arrowSize,
  showToResident,
  handleToggleShowToResident,
  handleTogglePopover,
}: IShowResidentButton) => {
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
                Mostra no QR Code
                <IconButton onClick={() => handleTogglePopover(false)} icon={icon.x} />
              </h3>

              <Style.Hr />

              {showToResident ? (
                <p className="p2">
                  Ao clicar em remover, o morador não poderá ver o chamado no QR Code.
                </p>
              ) : (
                <p className="p2">
                  Ao clicar em mostrar, o morador poderá ver o chamado no QR Code .
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button
                  label={showToResident ? 'Remover' : 'Mostrar'}
                  bgColor={theme.color.primary}
                  onClick={handleToggleShowToResident}
                />
              </div>
            </Style.PopoverBody>
          </Style.PopoverBackground>
        </ArrowContainer>
      </ArrowContainer>
    </Style.AnimationDiv>
  );
};
