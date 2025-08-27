/* eslint-disable react/button-has-type */
// COMPONENTS
import { useHasPermission } from '@hooks/useHasPermission';
import { theme } from '@styles/theme';
import { Image } from '@components/Image';
import { Background, ContainerButton, SpinnerContent } from './styles';

// TYPES
import type { IButton } from './utils/types';

export const Button = ({
  label,
  disable = false,
  loading = false,
  outlined = false,
  center = false,
  bgColor = theme.color.primary,
  borderless = false,
  textColor,
  permToCheck,
  icon,
  size = '24px',
  ...rest
}: IButton) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

  if (permToCheck && !hasPermission) {
    return null;
  }

  return (
    <Background center={center}>
      <ContainerButton
        bgColor={bgColor}
        loading={loading}
        disable={disable}
        outlined={outlined}
        borderless={borderless}
        textColor={textColor}
      >
        <button {...rest} disabled={disable || loading}>
          {loading ? (
            <SpinnerContent />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.size.xxsm }}>
              {icon && <Image img={icon} size={size} radius="0px" />}
              <h6>{label}</h6>
            </div>
          )}
        </button>
      </ContainerButton>
    </Background>
  );
};
