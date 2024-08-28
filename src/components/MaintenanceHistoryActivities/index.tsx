import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Api } from '../../services/api';
import { catchHandler, dateTimeFormatter, uploadManyFiles } from '../../utils/functions';
import { IActivity } from './types';
import * as Style from './styles';
import { icon } from '../../assets/icons';
import { IconButton } from '../Buttons/IconButton';
import { ImageComponent } from '../ImageComponent';
import { ImagePreview } from '../ImagePreview';
import { DotLoading } from '../Loadings/DotLoading';
import { TextArea } from '../Inputs/TextArea';
import { useAuthContext } from '../../contexts/Auth/UseAuthContext';

interface IMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

interface AnnexesAndImages {
  originalName: string;
  url: string;
}

export const MaintenanceHistoryActivities = ({
  maintenanceHistoryId,
}: IMaintenanceHistoryActivities) => {
  const [comment, setComment] = useState('');
  const [onQuery, setOnQuery] = useState(false);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const { account } = useAuthContext();

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
        // setLoading(false);
      });
  };

  const createActivity = async () => {
    setOnQuery(true);

    await Api.post(`/maintenance-history-activities`, {
      maintenanceHistoryId,
      content: comment || null,
      images: imagesToUpload,
      userId: account?.User.id,
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

  useEffect(() => {
    findMaintenanceHistoryActivities();
  }, []);

  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onImageQuery,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedImages = async () => {
        setOnImageQuery(true);

        const uploadedImages = await uploadManyFiles(acceptedFiles);

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
  }, [acceptedFiles]);

  return (
    <Style.Container>
      <Style.SendDataSection>
        <Style.InputRow>
          <TextArea
            name="activity"
            label="Enviar comentário"
            placeholder="Escreva seu comentário"
            value={comment}
            onChange={(evt) => {
              setComment(evt.target.value);
            }}
          />
          <Style.InputButtons>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
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
          </Style.InputButtons>
        </Style.InputRow>
        {(imagesToUpload.length > 0 || onImageQuery) && (
          <Style.FileAndImageRow>
            {imagesToUpload.map((e, i: number) => (
              <ImagePreview
                key={e.url}
                width="97px"
                height="97px"
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
              acceptedFiles.map((e) => (
                <Style.ImageLoadingTag key={e.name}>
                  <DotLoading />
                </Style.ImageLoadingTag>
              ))}
          </Style.FileAndImageRow>
        )}
      </Style.SendDataSection>

      {activities.length > 0 ? (
        <Style.History>
          <h3>Históricos</h3>
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
                    {content && <pre className="p2">{content}</pre>}

                    {images.length > 0 && (
                      <Style.FileAndImageRow>
                        {images.map((e) => (
                          <ImagePreview
                            key={e.url}
                            width="97px"
                            height="97px"
                            imageCustomName={e.name}
                            src={e.url}
                            downloadUrl={e.url}
                          />
                        ))}
                      </Style.FileAndImageRow>
                    )}
                  </Style.Comment>
                );
              }
              return null;
            })}
          </Style.ScrollDiv>
        </Style.History>
      ) : (
        <Style.History>
          <h3>Históricos</h3>
          <p className="p2 opacity">Não há registros no momento.</p>
        </Style.History>
      )}
    </Style.Container>
  );
};
