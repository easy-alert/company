import { ReactElement } from 'react';
import * as Style from './styles';

export const LoadingWrapper = ({
  minHeight,
  children,
}: {
  minHeight: string;
  children: ReactElement;
}) => (
  <Style.LoadingWrapperDiv minHeight={minHeight}>
    {children}
  </Style.LoadingWrapperDiv>
);
