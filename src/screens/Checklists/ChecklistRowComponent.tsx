// eslint-disable-next-line import/no-cycle
import { IChecklist } from '.';
import { icon } from '../../assets/icons';
import { IconButton } from '../../components/Buttons/IconButton';
import { ImageComponent } from '../../components/ImageComponent';
import * as Style from './styles';

interface IChecklistRow {
  checklist: IChecklist;
}

export const ChecklistRowComponent = ({
  checklist: { id, name, status, syndic },
}: IChecklistRow) => (
  <Style.ChecklistRow key={id} status={status}>
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
);
