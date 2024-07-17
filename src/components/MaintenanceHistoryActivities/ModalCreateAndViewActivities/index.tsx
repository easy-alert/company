/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import * as Style from './styles';
import { DotSpinLoading } from '../../Loadings/DotSpinLoading';
import { LoadingWrapper } from '../../Loadings/LoadingWrapper';
import { CustomModal } from '../../CustomModal';
import { IActivity } from '../types';
import { Input } from '../../Inputs/Input';
import { IconButton } from '../../Buttons/IconButton';
import { icon } from '../../../assets/icons';
import { ImageComponent } from '../../ImageComponent';

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
  const [comment, setComment] = useState('');
  const [onQuery, setOnQuery] = useState(false);

  const createActivity = async () => {
    setOnQuery(true);

    await Api.post(`/suppliers/link-to-maintenance-history`, {
      maintenanceHistoryId,
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
                if (evt.key === 'Enter') {
                  createActivity();
                }
              }}
            />
            <IconButton
              loading={onQuery}
              icon={icon.send}
              onClick={() => {
                createActivity();
              }}
            />
          </Style.InputRow>

          {activities.length > 0 ? (
            <Style.ScrollDiv>
              {activities.map(({ id }) => (
                <Style.Comment key={id}>
                  <Style.CommentHeader>
                    <ImageComponent src={icon.activityComment} />
                    <Style.CommentInfo>
                      <h6>Mudar aqui de Fulano</h6>
                      <p className="p3">Mudar aqui</p>
                    </Style.CommentInfo>
                  </Style.CommentHeader>
                  <p className="p2">Mudar aqui</p>
                </Style.Comment>
              ))}
            </Style.ScrollDiv>
          ) : (
            <p className="p2 opacity">Não há registros no momento.</p>
          )}
        </Style.Container>
      )}
    </CustomModal>
  );
};
