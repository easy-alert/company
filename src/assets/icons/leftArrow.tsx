import * as Style from './StyledSvg';

const IconLeftArrow = ({
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 13L5 8L10 3"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
    </svg>
  </Style.StyledSVG>
);

export default IconLeftArrow;
