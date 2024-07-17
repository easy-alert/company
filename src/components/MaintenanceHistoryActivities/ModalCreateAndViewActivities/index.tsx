/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { Api } from '../../../services/api';
import { catchHandler, dateTimeFormatter } from '../../../utils/functions';
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

interface IModalCreateAndViewActivities {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceHistoryId: string;
  loading: boolean;
  activities: IActivity[];
  findMaintenanceHistoryActivitiesCall: () => Promise<void>;
}

export const ModalCreateAndViewActivities = ({
  setModal,
  maintenanceHistoryId,
  activities,
  loading,
  findMaintenanceHistoryActivitiesCall,
}: IModalCreateAndViewActivities) => {
  const { account } = useAuthContext();
  const [comment, setComment] = useState('');
  const [onQuery, setOnQuery] = useState(false);

  const createActivity = async () => {
    setOnQuery(true);

    await Api.post(`/maintenance-history-activities`, {
      maintenanceHistoryId,
      content: comment,
      userId: account?.User.id,
    })
      .then(() => {
        findMaintenanceHistoryActivitiesCall();
        setComment('');
        // toast.success(res.data.ServerMessage.message);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  return (
    <CustomModal setModal={setModal} title="Atividades" id="activities" zIndex={20}>
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Container>
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
                if (evt.key === 'Enter' && comment) {
                  createActivity();
                }
              }}
            />
            <IconButton
              disabled={!comment}
              loading={onQuery}
              icon={icon.send}
              onClick={() => {
                createActivity();
              }}
            />
          </Style.InputRow>

          {activities.length > 0 ? (
            <Style.ScrollDiv>
              {activities.map(({ id, content, createdAt, title, type }) => {
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
                      <p className="p2">{content}</p>
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
