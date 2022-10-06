// LIBS
import { useState } from 'react';

// COMPONENTS
import { ArrowContainer, Popover } from 'react-tiny-popover';
import { IconButton } from '../IconButton';
import * as Style from './styles';
import { Button } from '../Button';

// TYPES
import { IPopoverButton } from './utils/types';

// THEMES
import { theme } from '../../../styles/theme';

// ICONS
import { icon } from '../../../assets/icons';

export const PopoverButton = ({
  type = 'Button',
  label = '',
  buttonIconSize = '24px',
  buttonIcon = '',
  iconButtonColor,
  bgColor,
  actionButtonBgColor,
  actionButtonClick,
  hiddenIconButtonLabel = false,
  borderless,
  loading,
  iconButtonClassName,
  disabled = false,
  message = {
    title: 'Title',
    content: 'Message Title',
    contentColor: theme.color.gray4,
  },
}: IPopoverButton) => {
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
    if (isPopoverOpen) {
      setIsPopoverOpen(false);
    } else {
      setIsPopoverOpen(true);
    }
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['left', 'top', 'bottom', 'right']}
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
                  <Style.PopoverBody
                    contentColor={message.contentColor ?? theme.color.gray4}
                  >
                    <h2>
                      {label}
                      <IconButton
                        onClick={() => {
                          setIsPopoverOpen(false);
                        }}
                        icon={icon.x}
                      />
                    </h2>
                    <Style.Hr />
                    <p className="p4">{message.title}</p>
                    <p className="p3">{message.content}</p>
                    <Style.Hr />
                    <Style.ActionButtonContainer>
                      <Button
                        label={label}
                        bgColor={actionButtonBgColor}
                        onClick={() => {
                          actionButtonClick();
                          togglePopOver();
                        }}
                      />
                    </Style.ActionButtonContainer>
                  </Style.PopoverBody>
                </Style.PopoverBackground>
              </ArrowContainer>
            </ArrowContainer>
          </Style.AnimationDiv>
        );
      }}
    >
      <Style.ButtonContainer>
        {type === 'Button' && (
          <Button
            disable={disabled}
            type="button"
            borderless={borderless}
            bgColor={bgColor}
            loading={loading}
            label={label}
            onClick={togglePopOver}
          />
        )}

        {type === 'IconButton' && (
          <IconButton
            disabled={disabled}
            hideLabelOnMedia
            className={iconButtonClassName}
            label={hiddenIconButtonLabel ? '' : label}
            color={iconButtonColor}
            icon={buttonIcon}
            size={buttonIconSize}
            onClick={togglePopOver}
          />
        )}
      </Style.ButtonContainer>
    </Popover>
  );
};
