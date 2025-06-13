import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

import * as Style from '../styles';

function ModalLoading() {
  return (
    <Style.OnQueryContainer>
      <DotSpinLoading />
    </Style.OnQueryContainer>
  );
}

export default ModalLoading;
