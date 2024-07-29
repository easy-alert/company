/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Api } from '../../../services/api';
import { catchHandler, dateTimeFormatter, uploadManyFiles } from '../../../utils/functions';
import * as Style from './styles';
import { DotSpinLoading } from '../../Loadings/DotSpinLoading';
import { LoadingWrapper } from '../../Loadings/LoadingWrapper';
import { CustomModal } from '../../CustomModal';
import { IActivity } from '../types';
import { Input } from '../../Inputs/Input';
import { IconButton } from '../../Buttons/IconButton';
import { icon } from '../../../assets/icons';
import { ImageComponent } from '../../ImageComponent';
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';
import { ImagePreview } from '../../ImagePreview';
import { DotLoading } from '../../Loadings/DotLoading';

interface IModalCreateAndViewActivities {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceHistoryId: string;
}

interface AnnexesAndImages {
  originalName: string;
  url: string;
}

export const ModalCreateAndViewActivities = ({
  setModal,
  maintenanceHistoryId,
}: IModalCreateAndViewActivities) => {
  const { account } = useAuthContext();
  const [comment, setComment] = useState('');
  const [onQuery, setOnQuery] = useState(false);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imagesToUpload, setImagesToUpload] = useState<AnnexesAndImages[]>([]);

  const findMaintenanceHistoryActivities = async () => {
    await Api.get(`/maintenance-history-activities/${maintenanceHistoryId}`)
      .then((res) => {
        setActivities(res.data.maintenanceHistoryActivities);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findMaintenanceHistoryActivities();
  }, []);

  const createActivity = async () => {
    setOnQuery(true);

    await Api.post(`/maintenance-history-activities`, {
      maintenanceHistoryId,
      content: comment || null,
      userId: account?.User.id,
      images: imagesToUpload,
    })
      .then(() => {
        findMaintenanceHistoryActivities();
        setComment('');
        setImagesToUpload([]);
        // toast.success(res.data.ServerMessage.message);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const {
    acceptedFiles: acceptedImages,
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'audio/flac': ['.flac'], // Colocado isso pro celular abrir as opções de camera corretamente.
    },
    disabled: onImageQuery,
  });

  useEffect(() => {
    if (acceptedImages.length > 0) {
      const uploadAcceptedImages = async () => {
        setOnImageQuery(true);

        const uploadedImages = await uploadManyFiles(acceptedImages);

        const formattedImages = uploadedImages.map((file) => ({
          originalName: file.originalname,
          url: file.Location,
        }));

        setImagesToUpload((prevState) => {
          let newState = [...prevState];
          newState = [...newState, ...formattedImages];
          return newState;
        });
        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  return (
    <CustomModal setModal={setModal} title="Atividades" id="activities" zIndex={20}>
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Container>
          <Style.SendDataSection>
            <Style.InputRow>
              <Input
                name="activity"
                label="Comentário"
                placeholder="Escreva seu comentário"
                value={comment}
                onChange={(evt) => {
                  setComment(evt.target.value);
                }}
                onKeyUp={(evt) => {
                  if (
                    evt.key === 'Enter' &&
                    (comment || imagesToUpload.length > 0) &&
                    !onImageQuery
                  ) {
                    createActivity();
                  }
                }}
              />
              <div {...getRootPropsImages({ className: 'dropzone' })}>
                <input {...getInputPropsImages()} />
                <IconButton
                  icon={icon.upload}
                  onClick={() => {
                    //
                  }}
                />
              </div>

              <IconButton
                disabled={(!comment && imagesToUpload.length === 0) || onImageQuery}
                loading={onQuery}
                icon={icon.send}
                onClick={() => {
                  createActivity();
                }}
              />
            </Style.InputRow>
            {(imagesToUpload.length > 0 || onImageQuery) && (
              <Style.FileAndImageRow>
                {imagesToUpload.map((e, i: number) => (
                  <ImagePreview
                    key={e.url}
                    width="125px"
                    height="125px"
                    imageCustomName={e.originalName}
                    src={e.url}
                    onTrashClick={() => {
                      setImagesToUpload((prevState) => {
                        const newState = [...prevState];
                        newState.splice(i, 1);
                        return newState;
                      });
                    }}
                  />
                ))}

                {onImageQuery &&
                  acceptedImages.map((e) => (
                    <Style.ImageLoadingTag key={e.name}>
                      <DotLoading />
                    </Style.ImageLoadingTag>
                  ))}
              </Style.FileAndImageRow>
            )}
          </Style.SendDataSection>

          {activities.length > 0 ? (
            <Style.ScrollDiv>
              {activities.map(({ id, content, createdAt, title, type, images }) => {
                if (type === 'comment') {
                  return (
                    <Style.Comment key={id}>
                      <Style.CommentHeader>
                        <ImageComponent src={icon.activityComment} />
                        <Style.CommentInfo>
                          <h6>{title}</h6>
                          <p className="p3">{dateTimeFormatter(createdAt)}</p>
                        </Style.CommentInfo>
                      </Style.CommentHeader>
                      {content && <p className="p2">{content}</p>}

                      <Style.FileAndImageRow>
                        {images.map((e) => (
                          <ImagePreview
                            key={e.url}
                            width="125px"
                            height="125px"
                            imageCustomName={e.name}
                            src={e.url}
                            downloadUrl={e.url}
                          />
                        ))}
                      </Style.FileAndImageRow>
                    </Style.Comment>
                  );
                }
                return null;
              })}
            </Style.ScrollDiv>
          ) : (
            <p className="p2 opacity">Não há registros no momento.</p>
          )}
        </Style.Container>
      )}
    </CustomModal>
  );
};
