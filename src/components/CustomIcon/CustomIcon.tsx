import * as Style from './styles';

import type { ICustomIcon } from './types';

const CustomIcon = ({
  children,
  height = '16px',
  width = '16px',
  fillColor = 'black',
  strokeColor = 'black',
  strokeWidth = '1.5',
  backgroundColor = 'transparent',
  padding = 'none',
}: ICustomIcon) => (
  <Style.StyledSVGContainer backgroundColor={backgroundColor} padding={padding}>
    <Style.StyledSVG
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
