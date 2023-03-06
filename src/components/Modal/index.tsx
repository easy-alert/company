// UI
import * as Style from './styles';
// ICONS
import { icon } from '../../assets/icons';

// TYPES
import { IModal } from './utils/types';
import { theme } from '../../styles/theme';
import { IconButton } from '../Buttons/IconButton';
import { query } from '../../utils/functions';

export const Modal = ({ children, setModal, title, bodyWidth }: IModal) => (
  <Style.Background
    id="background"
    onMouseDown={(evt: any) => {
      if (evt.target.id === 'background' && !query.get('flow')) setModal(false);
    }}
  >
    <Style.Body bodyWidth={bodyWidth}>
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
  </Style.Background>
);
