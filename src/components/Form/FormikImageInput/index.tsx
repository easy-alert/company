/* eslint-disable @typescript-eslint/no-explicit-any */
// GLOBAL ASSETS
import IconEdit from '@assets/icons/IconEdit';
import { icon } from '@assets/icons';

// GLOBAL COMPONENTS
import { Image } from '../../Image';

// COMPONENTS
import * as Style from './styles';

// TYPES
import { IUploader } from './utils/types';

export const FormikImageInput = ({
  label,
  error,
  defaultImage,
  name,
  onChange,
  customAddLogo,
  customEditLogo,
}: IUploader) => {
  const checkImageType = () => {
    if (defaultImage) {
      if (defaultImage instanceof File) {
        return URL.createObjectURL(defaultImage);
      }
      return defaultImage;
    }
    return icon.imageBackplate;
  };

  return (
    <Style.BackgroundSection>
      <h6>{label}</h6>
      <Style.Container>
        <Style.ImageWrapper>
          <img
            src={
              defaultImage
                ? customEditLogo ?? <IconEdit strokeColor="primary" fillColor="primary" />
                : customAddLogo ?? icon.plusWithBg
            }
            alt=""
          />
          <Image img={checkImageType()} size="80px" />
          <input
            name={name}
            type="file"
            onChange={onChange}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              height: '80px',
              width: '80px',
              top: 20,
              borderRadius: '100%',
              opacity: 0,
            }}
          />
          <Style.ErrorMessage>{!!error && <p className="p3">{error}</p>}</Style.ErrorMessage>
        </Style.ImageWrapper>
        <p className="p5">JPG ou PNG. Tamanho máximo de 5 MB.</p>
      </Style.Container>
    </Style.BackgroundSection>
  );
};
