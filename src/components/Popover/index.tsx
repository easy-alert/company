import { useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import * as Style from './styles';
import { theme } from '../../styles/theme';
import { IPopoverButton } from './types';

export const PopoverComponent = ({
  buttonChildren,
  contentChildren,
  label,
}: IPopoverButton) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  function getArrowStyle(positionParam: string | undefined, arrowSize: number) {
    switch (positionParam) {
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
    if (isPopoverOpen) {
      setIsPopoverOpen(false);
    } else {
      setIsPopoverOpen(true);
    }
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['right', 'left', 'top', 'bottom']}
      padding={1}
      onClickOutside={() => {
        setIsPopoverOpen(false);
      }}
      containerStyle={{ zIndex: '10' }}
      // eslint-disable-next-line react/no-unstable-nested-components
      content={({ position: positionParam, childRect, popoverRect }) => {
        const arrowSize = 10;
        return (
          <Style.AnimationDiv>
            <ArrowContainer
              position={positionParam}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={theme.color.gray3}
              arrowSize={arrowSize}
            >
              <ArrowContainer
                position={positionParam}
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
                arrowStyle={getArrowStyle(positionParam, arrowSize)}
              >
                <Style.PopoverBackground>
                  <Style.PopoverBody>
                    {label && <h5>{label}</h5>}

                    <Style.PopoverToggleDiv onClick={togglePopOver}>
                      {contentChildren}
                    </Style.PopoverToggleDiv>
                  </Style.PopoverBody>
                </Style.PopoverBackground>
              </ArrowContainer>
            </ArrowContainer>
          </Style.AnimationDiv>
        );
      }}
    >
      <Style.PopoverToggleDiv onClick={togglePopOver}>{buttonChildren}</Style.PopoverToggleDiv>
    </Popover>
  );
};
