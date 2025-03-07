import * as Style from './StyledSvg';

const IconPlusWithBackground = ({
  height = '16px',
  width = '16px',
  fillColor = 'black',
  strokeColor = 'black',
  strokeWidth = '1.5',
}: Style.IStyledSVG) => (
  <Style.StyledSVG
    height={height}
    width={width}
    fillColor={fillColor}
    strokeColor={strokeColor}
    strokeWidth={strokeWidth}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 12H17.5"
        stroke="white"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
      <path
        d="M12 6.5V17.5"
        stroke="white"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
    </svg>
  </Style.StyledSVG>
);

export default IconPlusWithBackground;
