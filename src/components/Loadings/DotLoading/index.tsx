import { theme } from '../../../styles/theme';
import { LoadingContainer, LoadingWrapper } from './styles';

interface IDotLoading {
  label?: string;
  bgColor?: string;
}

export const DotLoading = ({ label, bgColor = theme.color.primary }: IDotLoading) => (
  <LoadingContainer bgColor={bgColor}>
    <LoadingWrapper>
      {label && <h4>{label}</h4>}
      <div className="dot-pulse" />
    </LoadingWrapper>
  </LoadingContainer>
);
