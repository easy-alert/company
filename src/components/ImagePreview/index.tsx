// COMPONENTS
import { IconButton } from '../Buttons/IconButton';
import { Image } from '../Image';

// STYLES
import * as Style from './styles';
import { icon } from '../../assets/icons';

// TYPES
import { IImagePreview } from './types';
import { ImageComponent } from '../ImageComponent';

export const ImagePreview = ({
  src,
  imageCustomName,
  imageOriginalName,
  height,
  width,
  downloadUrl,
  onTrashClick,
  maxHeight = '500px',
  maxWidth = '500px',
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

    {(onTrashClick || downloadUrl) && (
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
        {downloadUrl && (
          <a href={downloadUrl} download target="_blank" rel="noreferrer">
            <Image img={icon.downloadRedBg} radius="0px" size="24px" />
          </a>
        )}
      </Style.ActionsHover>
    )}
  </Style.Container>
);
