import * as Style from './styles';

interface ICustomBackground {
  zIndex: number;
  onClick: () => void;
}

export const CustomBackground = ({ onClick, zIndex }: ICustomBackground) => (
  <Style.Background onClick={onClick} zIndex={zIndex} />
);
