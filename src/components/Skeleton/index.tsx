// COMPONENTS
import * as Style from './styles';

// TYPES
import { ISkeleton } from './types';

export const Skeleton = ({ height = '125px', width = '100%' }: ISkeleton) => (
  <Style.Container width={width} height={height} />
);
