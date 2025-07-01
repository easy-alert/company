import { LoadingContainer, LoadingWrapper } from './styles';

interface IDotLoading {
  label?: string;
  bgColor?: string;
}

export const DotLoading = ({ label, bgColor }: IDotLoading) => (
  <LoadingContainer bgColor={bgColor}>
    <LoadingWrapper>
      {label && <h4>{label}</h4>}
      <div className="dot-pulse" />
    </LoadingWrapper>
  </LoadingContainer>
);
