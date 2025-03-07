import * as Style from './StyledSvg';

const IconRedDot = ({
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
      <circle cx="12" cy="12" r="12" fill="#B21D1D" />
    </svg>
  </Style.StyledSVG>
);

export default IconRedDot;
