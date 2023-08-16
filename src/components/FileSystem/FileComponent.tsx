import { useEffect, useRef, useState } from 'react';
import * as Style from './styles';
import { icon } from '../../assets/icons/index';
import { Image } from '../Image';
import { IconButton } from '../Buttons/IconButton';
import { theme } from '../../styles/theme';
import { PopoverButton } from '../Buttons/PopoverButton';
import { detectFileExtension } from '../../utils/functions';

interface IFile {
  name: string;
  url: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const FileComponent = ({ name, url, onEditClick, onDeleteClick }: IFile) => {
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

  const imageExtensions = ['png', 'jpg', 'svg', 'jpeg'];

  const handleFileIcon = () => {
    const fileExtension = url && detectFileExtension(url);

    if (fileExtension && imageExtensions.includes(fileExtension)) {
      return icon.placeholder;
    }

    return icon.grayPaper;
  };

  return (
    <Style.Background ref={dropdownRef}>
      <Style.Wrapper>
        <Style.Download href={url} download target="_blank" rel="noreferrer">
          <Image img={handleFileIcon()} size="16px" />
          <p className="p4" title={name}>
            {name}
          </p>
        </Style.Download>

        <button type="button" onClick={toggleDropdown}>
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
              title: 'Deseja excluir este arquivo?',
              content: 'Atenção, essa ação é irreversível.',
              contentColor: theme.color.danger,
            }}
            fontWeight="400"
            labelPos="right"
            actionButtonClick={() => {
              onDeleteClick();
              setDropdownOpen(false);
            }}
          />
          <IconButton
            fontWeight="400"
            color={theme.color.gray5}
            labelPos="right"
            icon={icon.grayEdit}
            size="16px"
            onClick={() => {
              onEditClick();
              setDropdownOpen(false);
            }}
            label="Renomear"
          />
          <a href={url} download target="_blank" rel="noreferrer">
            <Image img={icon.grayDownload} size="16px" />
            <p className="p2">Download</p>
          </a>
        </Style.Dropdown>
      )}
    </Style.Background>
  );
};
