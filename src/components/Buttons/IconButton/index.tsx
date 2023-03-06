// COMPONENTS
import { theme } from '../../../styles/theme';
import { ContainerButton } from './styles';
import { Image } from '../../Image';

// TYPES
import { IIconButton } from './utils/types';

export const IconButton = ({
  labelPos = 'left',
  opacity,
  label,
  icon,
  gap = theme.size.xxsm,
  color = theme.color.gray4,
  selected,
  onClick,
  onAuxClick,
  className = 'p2',
  hideLabelOnMedia,
  fontWeight = '500',
  size = '24px;',
  disabled = false,
}: IIconButton) => (
  <ContainerButton
    hideLabelOnMedia={hideLabelOnMedia}
    labelPos={labelPos}
    selected={selected}
    opacity={opacity}
    gap={gap}
    color={color}
    fontWeight={fontWeight}
    disable={disabled}
    onClick={() => {
      if (!disabled) {
        onClick();
      }
    }}
    onAuxClick={() => {
      if (onAuxClick) onAuxClick();
    }}
  >
    <Image img={icon} size={size} radius="0px" />
    {label && <p className={className}>{label}</p>}
  </ContainerButton>
);
