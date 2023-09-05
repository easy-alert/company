import { IListTag } from './types';
import * as Style from './styles';
import { icon } from '../../assets/icons';
import { theme } from '../../styles/theme';
import { ImageComponent } from '../ImageComponent';

export const ListTag = ({
  label,
  onClick,
  disabled,
  backgroundColor = theme.color.primaryL,
  color = theme.color.gray5,
  fontWeight = 400,
  fontSize = '12px',
  padding = '6px',
}: IListTag) => (
  <Style.TagContainer
    backgroundColor={backgroundColor}
    color={color}
    fontWeight={fontWeight}
    fontSize={fontSize}
    padding={padding}
  >
    <p className="p4" title={label}>
      {label}
    </p>
    {onClick && (
      <button onClick={onClick} disabled={disabled} type="button">
        <ImageComponent src={icon.xBlack} size="14px" />
      </button>
    )}
  </Style.TagContainer>
);
