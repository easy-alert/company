export interface IStyledSVG {
  size?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
}

export interface IStyledSVGContainer {
  backgroundColor?: string;
  padding?: string;
}

export interface ICustomIcon extends IStyledSVGContainer, IStyledSVG {
  children?: React.ReactNode;
}
