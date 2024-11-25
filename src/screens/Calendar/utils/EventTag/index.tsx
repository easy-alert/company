// COMPONENTS
import * as Style from './styles';

// TYPES
import { IEventTag } from './types';

// FUNCTIONS
import { getStatusName } from './functions';

export const EventTag = ({ label, status, color, backgroundColor }: IEventTag) => {
  const paragraphText = label || getStatusName(status || '');

  return (
    <Style.TagContainer status={status} color={color} backgroundColor={backgroundColor}>
      <p className="p7">{paragraphText}</p>
    </Style.TagContainer>
  );
};
