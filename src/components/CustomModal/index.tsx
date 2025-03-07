// GLOBAL ASSETS
import IconX from '@assets/icons/x';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL COMPONENTS
import { IconButton } from '../Buttons/IconButton';

// COMPONENTS
import * as Style from './styles';

// TYPES
import { IModal } from './utils/types';

export const CustomModal = ({ children, setModal, title, bodyWidth, zIndex }: IModal) => (
  <Style.Body bodyWidth={bodyWidth} zIndex={zIndex}>
    <Style.Header>
      <h2>{title}</h2>
      <IconButton
        icon={<IconX strokeColor="primary" />}
        fill="primary"
        color={theme.color.primary}
        onClick={() => {
          setModal(false);
        }}
      />
    </Style.Header>
    {children}
  </Style.Body>
);
