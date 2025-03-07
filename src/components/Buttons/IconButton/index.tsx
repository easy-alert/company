// COMPONENTS
import { useHasPermission } from '@hooks/useHasPermission';
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
  className = 'p2',
  hideLabelOnMedia,
  fontWeight = '500',
  size = '24px;',
  disabled = false,
  title,
  loading,
  tabIndex,
  permToCheck,
  onClick,
  onAuxClick,
  hasCircle,
  fill,
}: IIconButton) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

  if (!hasPermission) {
    return null;
  }

  const content = () => {
    if (loading) {
      return <SpinnerContent $size={size} />;
    }

    if (fill) {
      return icon;
    }

    return <Image img={icon} size={size} radius="0px" />;
  };

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
      onClick={(evt) => {
        if (!disabled && !loading) {
          onClick(evt);
        }
      }}
      hasCircle={hasCircle}
      onAuxClick={(evt) => {
        if (onAuxClick) onAuxClick(evt);
      }}
      fill={fill}
      size={size}
    >
      {content()}
      {label && <p className={className}>{label}</p>}
    </ContainerButton>
  );
};
