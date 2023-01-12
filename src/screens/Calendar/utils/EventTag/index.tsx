// COMPONENTS
import * as Style from './styles';

// TYPES
import { IEventTag } from './types';

export const EventTag = ({ status }: IEventTag) => (
  <Style.TagContainer status={status}>
    <p className="p7">{status}</p>
  </Style.TagContainer>
);
