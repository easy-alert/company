// HOOKS
import { useHasPermission } from '@hooks/useHasPermission';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// COMPONENTS
import { Image } from '../../Image';

// STYLES
import { ContainerButton, SpinnerContent } from './styles';

// TYPES
import type { IIconButton } from './utils/types';

export const IconButton = ({
  labelPos = 'left',
  opacity,
  label,
  icon,
  gap = theme.size.xxsm,
  color = theme.color.gray4,
  selected,
  className = 'p2',
  hideLabelOnMedia,
  fontWeight = '500',
  size = '24px;',
  disabled = false,
  title,
  loading,
  tabIndex,
  zIndex,
  permToCheck,
  onClick,
  onAuxClick,
  ...rest
}: IIconButton) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

  if (permToCheck && !hasPermission) {
    return null;
  }

  return (
    <ContainerButton
      tabIndex={tabIndex}
      title={title}
      hideLabelOnMedia={hideLabelOnMedia}
      labelPos={labelPos}
      selected={selected}
      opacity={opacity}
      gap={gap}
      color={color}
      fontWeight={fontWeight}
      disable={disabled}
      size={size}
      zIndex={zIndex}
      onClick={(evt) => {
        if (!disabled && !loading) {
          onClick(evt);
        }
      }}
      onAuxClick={(evt) => {
        if (onAuxClick) onAuxClick(evt);
      }}
      {...rest}
    >
      {loading ? <SpinnerContent $size={size} /> : <Image img={icon} size={size} radius="0px" />}

      {label && <p className={className}>{label}</p>}
    </ContainerButton>
  );
};
