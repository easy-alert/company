export interface IStyledSVG {
  width?: string;
  height?: string;
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
