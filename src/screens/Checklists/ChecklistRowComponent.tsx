// REACT
import { useEffect, useRef, useState } from 'react';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { ImageComponent } from '@components/ImageComponent';
import { ModalCreateOccasionalMaintenance } from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { IBuildingForSelect } from '@customTypes/IBuildingForSelect';
import type { IChecklist } from '@customTypes/IChecklist';

// COMPONENTS
import { ModalDeleteChecklist } from './ModalDeleteChecklist';
import { ModalUpdateChecklist } from './ModalUpdateChecklist';

// STYLES
import * as Style from './styles';

// TYPES

interface IChecklistRow {
  checklist: IChecklist & { totalItems?: number; completedItems?: number };
  buildingsForSelect: IBuildingForSelect[];
  handleModals: (modal: string, modalState: boolean) => void;
  handleSelectedChecklistId: (checklistId: string) => void;
  onThenRequest: () => Promise<void>;
}

export const ChecklistRowComponent = ({
  checklist,
  buildingsForSelect,
  handleModals,
  handleSelectedChecklistId,
  onThenRequest,
}: IChecklistRow) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
      {modalDeleteChecklistOpen && (
        <ModalDeleteChecklist
          onThenRequest={onThenRequest}
          setModal={setModalDeleteChecklistOpen}
          checklistId={checklist.id!}
        />
      )}

      {modalUpdateChecklistOpen && (
        <ModalUpdateChecklist
          checklistId={checklist.id!}
          onThenRequest={onThenRequest}
          setModal={setModalUpdateChecklistOpen}
        />
      )}

      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          checklistActivity={checklist.name!}
          externalBuildingId={checklist.buildingId!}
          handleModalCreateOccasionalMaintenance={handleModalCreateOccasionalMaintenance}
          buildingsForSelect={buildingsForSelect}
        />
      )}

      <Style.ChecklistBackground ref={dropdownRef}>
        <Style.ChecklistWrapper>
          <Style.ChecklistRow
            key={checklist.id}
            status={checklist.status!}
            onClick={() => {
              handleModals('modalChecklistDetails', true);
              handleSelectedChecklistId(checklist.id!);
            }}
          >
            <Style.ChecklistRowLeftSide>
              <ImageComponent
                size="18px"
                src={
                  checklist.status === 'pending' ? icon.checklistUnchecked : icon.checklistChecked
                }
              />
              <Style.ChecklistContent>
                <p className="p4" style={{ marginBottom: '2px' }}>
                  {checklist.name} {checklist.completedItems}/{checklist.totalItems}
                </p>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {checklist.checklistUsers &&
                    checklist.checklistUsers.length > 0 &&
                    checklist.checklistUsers.map((user) => (
                      <ImageComponent
                        key={user?.id}
                        size="20px"
                        radius="50%"
                        src={user?.image || icon.personPlaceholder}
                        alt={user?.name || 'Usuário sem imagem'}
                      />
                    ))}
                </div>
              </Style.ChecklistContent>
            </Style.ChecklistRowLeftSide>
          </Style.ChecklistRow>

          <Style.DotsButton status={checklist.status!}>
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
