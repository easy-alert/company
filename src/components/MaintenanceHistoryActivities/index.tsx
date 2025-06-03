// REACT
import { useState, useEffect } from 'react';

// LIBS
import { useDropzone } from 'react-dropzone';

// SERVICES
import { Api } from '@services/api';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { ImageComponent } from '@components/ImageComponent';
import { ImagePreview } from '@components/ImagePreview';
import { DotLoading } from '@components/Loadings/DotLoading';
import { TextArea } from '@components/Inputs/TextArea';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { catchHandler, dateTimeFormatter, isImage, uploadManyFiles } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconUploadLine from '@assets/icons/IconUploadLine';
import IconSend from '@assets/icons/IconSend';

// GLOBAL TYPES
import type { IActivity } from '@customTypes/IActivity';
import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';

// STYLES
import * as Style from './styles';

// TYPES
import type { IMaintenanceHistoryActivities } from './types';

export const MaintenanceHistoryActivities = ({
  maintenanceHistoryId,
}: IMaintenanceHistoryActivities) => {
  const { account } = useAuthContext();

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  const [comment, setComment] = useState('');

  const [activeTab, setActiveTab] = useState<'comments' | 'notifications'>('comments');

  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUpload, setImagesToUpload] = useState<IAnnexesAndImages[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onImageQuery,
  });

  const [onQuery, setOnQuery] = useState(false);

  const sortFiles = (a: IAnnexesAndImages, b: IAnnexesAndImages) => {
    const imageExtensions = ['png', 'jpeg', 'jpg'];

    const extA = a.originalName.split('.').pop() || '';
    const extB = b.originalName.split('.').pop() || '';

    const isImageA = imageExtensions.includes(extA);
    const isImageB = imageExtensions.includes(extB);

    if (isImageA && !isImageB) {
      return -1; // Place A before B
    }
    if (!isImageA && isImageB) {
      return 1; // Place B before A
    }
    return 0; // Keep original order if both are in the same group
  };

  const sortFiles2 = (
    a: {
      id: string;
      url: string;
      name: string;
    },
    b: {
      id: string;
      url: string;
      name: string;
    },
  ) => {
    const imageExtensions = ['png', 'jpeg', 'jpg'];

    const extA = a.name.split('.').pop() || '';
    const extB = b.name.split('.').pop() || '';

    const isImageA = imageExtensions.includes(extA);
    const isImageB = imageExtensions.includes(extB);

    if (isImageA && !isImageB) {
      return -1; // Place A before B
    }
    if (!isImageA && isImageB) {
      return 1; // Place B before A
    }
    return 0; // Keep original order if both are in the same group
  };

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

  useEffect(() => {
    if (acceptedFiles.length === 0) return;

    const uploadAcceptedImages = async () => {
      setOnImageQuery(true);

      const uploadedImages = await uploadManyFiles([...acceptedFiles]);

      const formattedImages = uploadedImages.map((file) => ({
        name: file.originalname,
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
  }, [acceptedFiles]);

  useEffect(() => {
    if (activities.length === 0) return;

    if (activeTab === 'comments') {
      activities.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });

      setFilteredActivities(activities.filter((e) => e.type === 'comment'));
    }

    if (activeTab === 'notifications') {
      activities.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });

      setFilteredActivities(activities.filter((e) => e.type === 'notification'));
    }
  }, [activities, activeTab]);

  return (
    <Style.Container>
      <Style.SendDataSection>
        <Style.InputRow>
          <TextArea
            name="activity"
            label="Enviar comentário"
            placeholder="Escreva seu comentário"
            permToCheck="maintenances:update"
            onChange={(evt) => {
              setComment(evt.target.value);
            }}
          />

          <Style.InputButtons>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />

              <IconButton
                icon={
                  <IconUploadLine backgroundColor="primary" strokeColor="white" padding="4px" />
                }
                permToCheck="maintenances:update"
                onClick={() => {
                  //
                }}
              />
            </div>

            <IconButton
              icon={
                <IconSend
                  backgroundColor="primary"
                  strokeColor="white"
                  padding="4px"
                  strokeWidth="1.5"
                />
              }
              loading={onQuery}
              disabled={(!comment && imagesToUpload.length === 0) || onImageQuery}
              permToCheck="maintenances:update"
              onClick={() => {
                createActivity();
              }}
            />
          </Style.InputButtons>
        </Style.InputRow>

        {(imagesToUpload.length > 0 || onImageQuery) && (
          <Style.FileAndImageRow>
            {imagesToUpload.sort(sortFiles).map((e, i: number) => {
              if (isImage(e.url)) {
                return (
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
                );
              }

              return (
                <ListTag
                  downloadUrl={e.url}
                  key={e.url}
                  padding="4px 12px"
                  label={e.originalName}
                  maxWidth="100px"
                  onClick={() => {
                    setImagesToUpload((prevState) => {
                      const newState = [...prevState];
                      newState.splice(i, 1);
                      return newState;
                    });
                  }}
                />
              );
            })}

            {onImageQuery &&
              acceptedFiles.map((e) => (
                <Style.ImageLoadingTag key={e.name}>
                  <DotLoading />
                </Style.ImageLoadingTag>
              ))}
          </Style.FileAndImageRow>
        )}
      </Style.SendDataSection>

      <Style.History>
        <h3>Históricos</h3>

        <Style.Tabs>
          <Style.Tab onClick={() => setActiveTab('comments')} active={activeTab === 'comments'}>
            Comentários
          </Style.Tab>

          <Style.Tab
            onClick={() => setActiveTab('notifications')}
            active={activeTab === 'notifications'}
          >
            Notificações
          </Style.Tab>
        </Style.Tabs>

        {filteredActivities.length > 0 ? (
          <Style.ScrollDiv>
            {filteredActivities.map(({ id, content, createdAt, title, type, images }) => {
              if (type === 'comment') {
                return (
                  <Style.Comment key={id}>
                    <Style.CommentHeader>
                      <ImageComponent src={icon.activityComment} hasCircle />
                      <Style.CommentInfo>
                        <h6>{title}</h6>
                        <p className="p3">{dateTimeFormatter(createdAt)}</p>
                      </Style.CommentInfo>
                    </Style.CommentHeader>
                    {content && <pre className="p2">{content}</pre>}

                    {images.length > 0 && (
                      <Style.FileAndImageRow>
                        {images.sort(sortFiles2).map((e) => {
                          if (isImage(e.url)) {
                            return (
                              <ImagePreview
                                key={e.url}
                                width="97px"
                                height="97px"
                                imageCustomName={e.name}
                                src={e.url}
                                downloadUrl={e.url}
                              />
                            );
                          }

                          return (
                            <ListTag
                              downloadUrl={e.url}
                              key={e.url}
                              padding="4px 12px"
                              label={e.name}
                              maxWidth="100px"
                            />
                          );
                        })}
                      </Style.FileAndImageRow>
                    )}
                  </Style.Comment>
                );
              }

              if (type === 'notification') {
                return (
                  <Style.Comment key={id}>
                    <Style.CommentHeader>
                      <ImageComponent src={icon.activityNotification} hasCircle />
                      <Style.CommentInfo>
                        <h6>{title}</h6>
                        <p className="p3">{dateTimeFormatter(createdAt)}</p>
                      </Style.CommentInfo>
                    </Style.CommentHeader>
                    {content && <pre className="p2">{content}</pre>}
                  </Style.Comment>
                );
              }

              return null;
            })}
          </Style.ScrollDiv>
        ) : (
          <p className="p2 opacity">Não há registros no momento.</p>
        )}
      </Style.History>
    </Style.Container>
  );
};
