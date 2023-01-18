// COMPONENTS
import * as Style from './styles';

// TYPES
import { IEventTag } from './types';

// FUNCTIONS
import { getStatusName } from './functions';

export const EventTag = ({ status }: IEventTag) => (
  <Style.TagContainer status={status}>
    <p className="p7">{getStatusName(status)}</p>
  </Style.TagContainer>
);
