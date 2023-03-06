import { LoadingContainer, LoadingWrapper } from './styles';

interface IDotLoading {
  label?: string;
}

export const DotSpinLoading = ({ label }: IDotLoading) => (
  <LoadingContainer>
    <LoadingWrapper>
      <h4>{label}</h4>
      <div className="dot-spin" />
    </LoadingWrapper>
  </LoadingContainer>
);
