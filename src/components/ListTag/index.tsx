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
  lineHeight = '14px',
  downloadUrl,
}: IListTag) => (
  <Style.TagContainer
    backgroundColor={backgroundColor}
    color={color}
    fontWeight={fontWeight}
    fontSize={fontSize}
    padding={padding}
    lineHeight={lineHeight}
  >
    <p className="p4" title={label}>
      {label}
    </p>
    {downloadUrl && (
      <a href={downloadUrl} download target="_blank" rel="noreferrer">
        <ImageComponent src={icon.download} size="16px" />
      </a>
    )}
    {onClick && (
      <button onClick={onClick} disabled={disabled} type="button">
        <ImageComponent src={icon.xBlack} size="14px" />
      </button>
    )}
  </Style.TagContainer>
);
