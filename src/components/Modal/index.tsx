// GLOBAL ASSETS
import { IconButton } from '@components/Buttons/IconButton';
import { ShareMaintenanceHistoryButton } from '@components/ShareMaintenanceHistoryButton';

// GLOBAL COMPONENTS
import IconX from '@assets/icons/IconX';
import IconTrash from '@assets/icons/IconTrash';
import IconEdit from '@assets/icons/IconEdit';

// GLOBAL UTILS
import { query } from '@utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModal } from './utils/types';

export const Modal = ({
  id = 'background',
  children,
  title,
  bodyWidth,
  closeOutside = true,
  maintenanceHistoryId,
  zIndex = 10,
  setModal,
  handleDelete,
  handleEdit,
}: IModal) => (
  <Style.Background
    id={id}
    zIndex={zIndex}
    onMouseDown={(evt: any) => {
      if (evt.target.id === id && !query.get('flow') && closeOutside) setModal(false);
    }}
  >
    <Style.Body bodyWidth={bodyWidth}>
      <Style.Header>
        <h2>{title}</h2>

        <Style.IconsContainer>
          {handleEdit && (
            <IconButton
              icon={<IconEdit strokeColor="primary" strokeWidth="2" />}
              permToCheck="maintenances:updateDates"
              onClick={() => handleEdit(true)}
            />
          )}

          {handleDelete && (
            <IconButton
              icon={<IconTrash strokeColor="primary" strokeWidth="2" />}
              onClick={() => handleDelete(true)}
            />
          )}

          {maintenanceHistoryId && (
            <ShareMaintenanceHistoryButton maintenanceHistoryId={maintenanceHistoryId} />
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
