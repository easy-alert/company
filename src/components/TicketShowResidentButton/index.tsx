// REACT
import { useState } from 'react';

// LIBS
import { Popover } from 'react-tiny-popover';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// COMPONENTS
import { ShowResidentButton } from './components/ShowResidentButton';

// STYLES
import * as Style from './styles';

interface ITicketShowResidentButton {
  showToResident?: boolean;
  handleToggleShowToResident: () => void;
}

export const TicketShowResidentButton = ({
  showToResident = false,
  handleToggleShowToResident,
}: ITicketShowResidentButton) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleTogglePopover = (popover?: boolean) => {
    if (typeof popover === 'boolean') {
      setIsPopoverOpen(popover);
    } else {
      setIsPopoverOpen((prev) => !prev);
    }
  };

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
      content={({ position, childRect, popoverRect }) => (
        <ShowResidentButton
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowSize={10}
          showToResident={showToResident}
          handleToggleShowToResident={handleToggleShowToResident}
          handleTogglePopover={handleTogglePopover}
        />
      )}
    >
      <Style.ButtonContainer>
        <IconButton
          icon={showToResident ? icon.qrCodeChecked : icon.qrCodeUnchecked}
          onClick={handleTogglePopover}
        />
      </Style.ButtonContainer>
    </Popover>
  );
};
