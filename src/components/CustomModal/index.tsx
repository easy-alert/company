// UI
import * as Style from './styles';
// ICONS
import { icon } from '../../assets/icons';

// TYPES
import { IModal } from './utils/types';
import { theme } from '../../styles/theme';
import { IconButton } from '../Buttons/IconButton';

export const CustomModal = ({ children, setModal, title, bodyWidth, zIndex }: IModal) => (
  <Style.Body bodyWidth={bodyWidth} zIndex={zIndex}>
    <Style.Header>
      <h2>{title}</h2>
      <IconButton
        icon={icon.x}
        color={theme.color.primary}
        onClick={() => {
          setModal(false);
        }}
      />
    </Style.Header>
    {children}
  </Style.Body>
);
