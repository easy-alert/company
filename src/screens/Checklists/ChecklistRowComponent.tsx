// REACT
import { useEffect, useRef, useState } from 'react';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { ImageComponent } from '@components/ImageComponent';
import { ModalCreateOccasionalMaintenance } from '@components/ModalCreateOccasionalMaintenance';

// GLOBAL UTILS
import { ITimeInterval } from '@utils/types';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { IBuildingForSelect } from '@customTypes/IBuildingForSelect';

// COMPONENTS
import { ModalChecklistDetails } from './ModalChecklistDetails';
import { ModalDeleteChecklist } from './ModalDeleteChecklist';
import { ModalUpdateChecklist } from './ModalUpdateChecklist';

// STYLES
import * as Style from './styles';

// TYPES
import type { IChecklist } from '.';

interface IChecklistRow {
  checklist: IChecklist;
  timeIntervals: ITimeInterval[];
  buildingsForSelect: IBuildingForSelect[];
  handleModals: (modal: string, modalState: boolean) => void;
  handleSelectedChecklistId: (checklistId: string) => void;
  onThenRequest: () => Promise<void>;
}

export const ChecklistRowComponent = ({
  checklist: { id, name, status, syndic, buildingId },
  timeIntervals,
  buildingsForSelect,
  handleModals,
  handleSelectedChecklistId,
  onThenRequest,
}: IChecklistRow) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [modalChecklistDetailsOpen, setModalChecklistDetailsOpen] = useState(false);
  const [modalDeleteChecklistOpen, setModalDeleteChecklistOpen] = useState(false);
  const [modalUpdateChecklistOpen, setModalUpdateChecklistOpen] = useState(false);
  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
    useState<boolean>(false);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleModalCreateOccasionalMaintenance = (modalState: boolean) => {
    setModalCreateOccasionalMaintenance(modalState);
  };

  useEffect(() => {
    const handleClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {modalChecklistDetailsOpen && (
        <ModalChecklistDetails
          checklistId={id}
          setModal={setModalChecklistDetailsOpen}
          onThenRequest={onThenRequest}
        />
      )}

      {modalDeleteChecklistOpen && (
        <ModalDeleteChecklist
          onThenRequest={onThenRequest}
          setModal={setModalDeleteChecklistOpen}
          checklistId={id}
        />
      )}

      {modalUpdateChecklistOpen && (
        <ModalUpdateChecklist
          setModal={setModalUpdateChecklistOpen}
          timeIntervals={timeIntervals}
          onThenRequest={onThenRequest}
          checklistId={id}
        />
      )}

      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          checklistActivity={name}
          externalBuildingId={buildingId}
          handleModalCreateOccasionalMaintenance={handleModalCreateOccasionalMaintenance}
          buildingsForSelect={buildingsForSelect}
        />
      )}

      <Style.ChecklistBackground ref={dropdownRef}>
        <Style.ChecklistWrapper>
          <Style.ChecklistRow
            key={id}
            status={status}
            onClick={() => {
              handleModals('modalChecklistDetails', true);
              handleSelectedChecklistId(id);
            }}
          >
            <Style.ChecklistRowLeftSide>
              <ImageComponent
                size="18px"
                src={status === 'pending' ? icon.checklistUnchecked : icon.checklistChecked}
              />
              <Style.ChecklistContent>
                <p className="p4">{name}</p>
                <p className="p5">{syndic?.name || 'Nenhum responsável vinculado'}</p>
              </Style.ChecklistContent>
            </Style.ChecklistRowLeftSide>
          </Style.ChecklistRow>

          <Style.DotsButton status={status}>
            <IconButton
              icon={icon.dots}
              size="24px"
              onClick={() => {
                toggleDropdown();
              }}
            />
          </Style.DotsButton>
        </Style.ChecklistWrapper>

        {dropdownOpen && (
          <Style.Dropdown>
            <IconButton
              fontWeight="400"
              color={theme.color.gray5}
              labelPos="right"
              icon={icon.grayTrash}
              size="16px"
              onClick={() => {
                setModalDeleteChecklistOpen(true);
                setDropdownOpen(false);
              }}
              label="Excluir"
            />

            <IconButton
              fontWeight="400"
              color={theme.color.gray5}
              labelPos="right"
              icon={icon.grayEdit}
              size="16px"
              onClick={() => {
                setModalUpdateChecklistOpen(true);
                setDropdownOpen(false);
              }}
              label="Editar"
            />

            <IconButton
              fontWeight="400"
              color={theme.color.gray5}
              labelPos="right"
              icon={icon.addWithCircle}
              size="16px"
              onClick={() => {
                setModalCreateOccasionalMaintenance(true);
                setDropdownOpen(false);
              }}
              label="Manutenção"
            />
          </Style.Dropdown>
        )}
      </Style.ChecklistBackground>
    </>
  );
};
