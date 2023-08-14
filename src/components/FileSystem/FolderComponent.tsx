import { useEffect, useRef, useState } from 'react';
import * as Style from './styles';
import { icon } from '../../assets/icons/index';
import { Image } from '../Image';
import { IconButton } from '../Buttons/IconButton';
import { theme } from '../../styles/theme';
import { PopoverButton } from '../Buttons/PopoverButton';

interface IFolder {
  name: string;
}

export const FolderComponent = ({ name }: IFolder) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
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
    <Style.Background ref={dropdownRef}>
      <Style.Wrapper
        onClick={() => {
          // console.log('folder click');
        }}
      >
        <Image img={icon.folder} size="16px" />
        <p className="p4" title={name}>
          {name}
        </p>

        <button
          type="button"
          onClick={(e) => {
            toggleDropdown(e);
          }}
        >
          <Image img={icon.dots} size="16px" />
        </button>
      </Style.Wrapper>

      {dropdownOpen && (
        <Style.Dropdown>
          <PopoverButton
            actionButtonBgColor={theme.color.actionDanger}
            type="IconButton"
            buttonIcon={icon.grayTrash}
            buttonIconSize="16px"
            iconButtonColor={theme.color.gray5}
            label="Excluir"
            message={{
              title: 'Deseja excluir esta pasta?',
              content: 'Atenção, todas as pastas e arquivos dentro desta pasta serão excluídos.',
              contentColor: theme.color.danger,
            }}
            fontWeight="400"
            labelPos="right"
            actionButtonClick={() => {
              // requestDeleteBuilding({
              //   setModal,
              //   setOnQuery,
              //   buildingId: building.id,
              //   navigate,
              // });
            }}
          />
          <IconButton
            fontWeight="400"
            color={theme.color.gray5}
            labelPos="right"
            icon={icon.grayEdit}
            size="16px"
            onClick={() => {
              //
            }}
            label="Renomear"
          />
        </Style.Dropdown>
      )}
    </Style.Background>
  );
};
