import { icon } from '../../assets/icons';
import { ImageComponent } from '../ImageComponent';
import * as Style from './styles';
import { INoDataFound } from './types';

export const NoDataFound = ({ label, height = '80dvh' }: INoDataFound) => (
  <Style.Container height={height}>
    <ImageComponent src={icon.paper} size="80px" />
    <h5>{label}</h5>
  </Style.Container>
);
