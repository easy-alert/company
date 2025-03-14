// GLOBAL ASSETS
import IconX from '@assets/icons/IconX';
import { icon } from '@assets/icons';

// GLOBAL COMPONENTS
import IconTrash from '@assets/icons/IconTrash';
import { IconButton } from '../Buttons/IconButton';

// GLOBAL STYLES
import { theme } from '../../styles/theme';

// GLOBAL UTILS / FUNCTIONS
import { query } from '../../utils/functions';

// COMPONENTS
import * as Style from './styles';

// TYPES
import { IModal } from './utils/types';

export const Modal = ({
  id = 'background',
  children,
  title,
  bodyWidth,
  closeOutside = true,
  deleteButton = false,
  setModal,
  handleDelete,
}: IModal) => (
  <Style.Background
    id={id}
    onMouseDown={(evt: any) => {
      if (evt.target.id === id && !query.get('flow') && closeOutside) setModal(false);
    }}
  >
    <Style.Body bodyWidth={bodyWidth}>
      <Style.Header>
        <h2>{title}</h2>

        <Style.IconsContainer>
          {deleteButton && (
            <IconButton
              icon={<IconTrash strokeColor="primary" strokeWidth="2" />}
              onClick={() => handleDelete && handleDelete(true)}
            />
          )}

          <IconButton
            icon={<IconX strokeColor="primary" strokeWidth="2" />}
            onClick={() => setModal(false)}
          />
        </Style.IconsContainer>
      </Style.Header>

      {children}
    </Style.Body>
  </Style.Background>
);
