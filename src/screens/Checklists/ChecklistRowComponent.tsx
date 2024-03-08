import { useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { IChecklist } from '.';
import { icon } from '../../assets/icons';
import { IconButton } from '../../components/Buttons/IconButton';
import { ImageComponent } from '../../components/ImageComponent';
import * as Style from './styles';
import { ModalChecklistDetails } from './ModalChecklistDetails';

interface IChecklistRow {
  checklist: IChecklist;
}

export const ChecklistRowComponent = ({
  checklist: { id, name, status, syndic },
}: IChecklistRow) => {
  const [modalChecklistDetailsOpen, setModalChecklistDetailsOpen] = useState(false);

  return (
    <>
      {modalChecklistDetailsOpen && (
        <ModalChecklistDetails checklistId={id} setModal={setModalChecklistDetailsOpen} />
      )}
      <Style.ChecklistRow
        key={id}
        status={status}
        onClick={() => {
          setModalChecklistDetailsOpen(true);
        }}
      >
        <Style.ChecklistRowLeftSide>
          <ImageComponent
            size="16px"
            src={status === 'pending' ? icon.checklistUnchecked : icon.checklistChecked}
          />
          <Style.ChecklistContent>
            <p className="p4">{name}</p>
            <p className="p5">{syndic.name}</p>
          </Style.ChecklistContent>
        </Style.ChecklistRowLeftSide>
        <IconButton
          icon={icon.dots}
          size="24px"
          onClick={() => {
            //
          }}
        />
      </Style.ChecklistRow>
    </>
  );
};
