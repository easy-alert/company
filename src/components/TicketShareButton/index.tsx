// REACT
import { useState } from 'react';

// LIBS
import { Popover } from 'react-tiny-popover';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';

import IconUploadLine from '@assets/icons/IconUploadLine';
import { ShareButton } from './components/ShareButton';

// STYLES
import * as Style from './styles';

export const TicketShareButton = ({ ticketId }: { ticketId: string }) => {
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
        <ShareButton
          ticketId={ticketId}
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowSize={10}
          handleTogglePopover={handleTogglePopover}
        />
      )}
    >
      <Style.ButtonContainer>
        <IconButton
          icon={<IconUploadLine strokeColor="primary" />}
          onClick={handleTogglePopover}
        />
      </Style.ButtonContainer>
    </Popover>
  );
};
