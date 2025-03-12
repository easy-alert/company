import * as Style from './styles';

import type { ICustomIcon } from './types';

const CustomIcon = ({
  children,
  height = '16px',
  width = '16px',
  size = '16px',
  viewBox = '0 0 16 16',
  fillColor = 'black',
  strokeColor = 'black',
  strokeWidth = '1',
  backgroundColor = 'transparent',
  padding = 'none',
}: ICustomIcon) => (
  <Style.StyledSVGContainer backgroundColor={backgroundColor} padding={padding}>
    <Style.StyledSVG
      viewBox={viewBox}
      size={size}
      height={height}
      width={width}
      fillColor={fillColor}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    >
      {children}
    </Style.StyledSVG>
  </Style.StyledSVGContainer>
);

export default CustomIcon;
