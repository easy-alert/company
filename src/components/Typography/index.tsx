import { IStyledTypography, StyledTypography } from './styles';

interface ITypography extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>, IStyledTypography {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  children: React.ReactNode;
}

const Typography = ({ variant = 'p', children, ...props }: ITypography) => {
  const Component = StyledTypography[variant];

  return <Component {...props}>{children}</Component>;
};

export default Typography;
