// GLOBAL ASSETS
import IconEdit from '@assets/icons/IconEdit';
import { icon } from '../../assets/icons';

// GLOBAL COMPONENTS
import { IconButton } from '../Buttons/IconButton';
import { Image } from '../Image';
import { ImageComponent } from '../ImageComponent';

// STYLES
import * as Style from './styles';

// TYPES
import { IImagePreview } from './types';

export const ImagePreview = ({
  src,
  imageCustomName,
  imageOriginalName,
  height,
  width,
  downloadUrl,
  maxHeight = '500px',
  maxWidth = '500px',
  onUpdateClick,
  onTrashClick,
}: IImagePreview) => (
  <Style.Container height={height} width={width} maxHeight={maxHeight} maxWidth={maxWidth}>
    <ImageComponent src={src} alt="" />
    <Style.Label>
      <p className="p2" title={imageCustomName}>
        {imageCustomName}
      </p>
      {imageOriginalName && (
        <p className="p5" title={imageOriginalName}>
          {imageOriginalName}
        </p>
      )}
    </Style.Label>

    {(onTrashClick || downloadUrl || onUpdateClick) && (
      <Style.ActionsHover>
        {onTrashClick && (
          <IconButton
            icon={icon.trashWithPrimaryBg}
            size="24px"
            onClick={() => {
              onTrashClick();
            }}
          />
        )}
        {onUpdateClick && (
          <IconButton
            fill="primary"
            icon={<IconEdit strokeColor="primary" />}
            size="24px"
            onClick={() => {
              onUpdateClick();
            }}
          />
        )}
        {downloadUrl && (
          <a href={downloadUrl} download target="_blank" rel="noreferrer">
            <Image img={icon.downloadRedBg} size="24px" radius="" />
          </a>
        )}
      </Style.ActionsHover>
    )}
  </Style.Container>
);
