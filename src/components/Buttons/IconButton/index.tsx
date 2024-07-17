// COMPONENTS
import { theme } from '../../../styles/theme';
import { ContainerButton, SpinnerContent } from './styles';
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
  title,
  loading,
}: IIconButton) => (
  <ContainerButton
    title={title}
    hideLabelOnMedia={hideLabelOnMedia}
    labelPos={labelPos}
    selected={selected}
    opacity={opacity}
    gap={gap}
    color={color}
    fontWeight={fontWeight}
    disable={disabled}
    onClick={(evt) => {
      if (!disabled && !loading) {
        onClick(evt);
      }
    }}
    onAuxClick={(evt) => {
      if (onAuxClick) onAuxClick(evt);
    }}
  >
    {loading ? <SpinnerContent $size={size} /> : <Image img={icon} size={size} radius="0px" />}

    {label && <p className={className}>{label}</p>}
  </ContainerButton>
);
