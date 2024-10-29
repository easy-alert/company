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

// ASSETS
import { icon } from '@assets/icons';

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

  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onImageQuery,
  });

  const [comment, setComment] = useState('');
  const [onQuery, setOnQuery] = useState(false);
  const [activities, setActivities] = useState<IActivity[]>([]);

  const [imagesToUpload, setImagesToUpload] = useState<IAnnexesAndImages[]>([]);

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

  // const addOccasionalActivity = () => {
  //   setOccasionallyActivities((prevState) => {
  //     const newState = [...prevState];

  //     const newImages = imagesToUpload.map((image) => ({
  //       name: image.name,
  //       url: image.url,
  //       type: image.type,
  //     }));

  //     newState.push({
  //       id: Math.random().toString(),
  //       content: comment,
  //       images: newImages as IOccasionallyActivitiesImages[],
  //       userId: account?.User.id,
  //       createdAt: new Date().toISOString(),
  //     });

  //     return newState.sort((a, b) => {
  //       const dateA = new Date(a.createdAt).getTime();
  //       const dateB = new Date(b.createdAt).getTime();

  //       return dateB - dateA;
  //     });
  //   });

  //   setComment('');
  //   setImagesToUpload([]);
  // };

  useEffect(() => {
    findMaintenanceHistoryActivities();
  }, []);

  useEffect(() => {
    const uploadAcceptedImages = async () => {
      setOnImageQuery(true);

      const uploadedImages = await uploadManyFiles(acceptedFiles);

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

    // if (maintenanceType === 'occasional' && acceptedFiles.length > 0) {
    //   const formattedImages = acceptedFiles.map((file) => ({
    //     name: file.name,
    //     originalName: file.name,
    //     url: URL.createObjectURL(file),
    //     type: file.type,
    //   }));

    //   setImagesToUpload((prevState) => {
    //     let newState = [...prevState];
    //     newState = [...newState, ...formattedImages];

    //     return newState;
    //   });
    // }
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
                      <ImageComponent src={icon.activityNotification} />
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

        {/* {maintenanceType === 'occasional' &&
          (occasionallyActivities.length > 0 ? (
            <Style.ScrollDiv>
              {occasionallyActivities.map(({ id, content, createdAt, images }) => (
                <Style.Comment key={id}>
                  <Style.CommentHeader>
                    <ImageComponent src={icon.activityComment} />

                    <Style.CommentInfo>
                      <h6>{`Nova atividade de ${account?.User.name}`}</h6>
                      <p className="p3">{dateTimeFormatter(createdAt)}</p>
                    </Style.CommentInfo>

                    <div style={{ marginLeft: 'auto', marginRight: '8px' }}>
                      <IconButton
                        icon={icon.trash}
                        onClick={() => {
                          setOccasionallyActivities((prevState) => {
                            const newState = [...prevState];
                            newState.splice(
                              newState.findIndex((e) => e.id === id),
                              1,
                            );
                            return newState;
                          });
                        }}
                      />
                    </div>
                  </Style.CommentHeader>

                  {content && <pre className="p2">{content}</pre>}

                  {images.length > 0 && (
                    <Style.FileAndImageRow>
                      {images.sort().map((image) => {
                        if (isImage(image.type)) {
                          return (
                            <ImagePreview
                              key={image.url}
                              src={image.url || ''}
                              downloadUrl={image.url}
                              imageCustomName={image.name}
                              width="97px"
                              height="97px"
                            />
                          );
                        }

                        return (
                          <ListTag
                            key={image.url}
                            downloadUrl={image.url}
                            label={image.name}
                            padding="4px 12px"
                            maxWidth="100px"
                          />
                        );
                      })}
                    </Style.FileAndImageRow>
                  )}
                </Style.Comment>
              ))}
            </Style.ScrollDiv>
          ) : (
            <p className="p2 opacity">Não há registros no momento.</p>
          ))} */}
      </Style.History>
    </Style.Container>
  );
};
