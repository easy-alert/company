/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { IChecklist } from '.';
import { icon } from '../../assets/icons';
import { IconButton } from '../../components/Buttons/IconButton';
import { ImageComponent } from '../../components/ImageComponent';
import * as Style from './styles';
import { ModalChecklistDetails } from './ModalChecklistDetails';
import { theme } from '../../styles/theme';
import { ModalDeleteChecklist } from './ModalDeleteChecklist';

interface IChecklistRow {
  checklist: IChecklist;
  onThenRequest: () => Promise<void>;
}

export const ChecklistRowComponent = ({
  checklist: { id, name, status, syndic },
  onThenRequest,
}: IChecklistRow) => {
  const [modalChecklistDetailsOpen, setModalChecklistDetailsOpen] = useState(false);
  const [modalDeleteChecklistOpen, setModalDeleteChecklistOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
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
      <Style.ChecklistBackground ref={dropdownRef}>
        <Style.ChecklistWrapper>
          <Style.ChecklistRow
            key={id}
            status={status}
            onClick={() => {
              setModalChecklistDetailsOpen(true);
            }}
          >
            <Style.ChecklistRowLeftSide>
              <ImageComponent
                size="18px"
                src={status === 'pending' ? icon.checklistUnchecked : icon.checklistChecked}
              />
              <Style.ChecklistContent>
                <p className="p4">{name}</p>
                <p className="p5">{syndic.name}</p>
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
                // onEditClick();
                setDropdownOpen(false);
              }}
              label="Editar"
            />
          </Style.Dropdown>
        )}
      </Style.ChecklistBackground>
    </>
  );
};
