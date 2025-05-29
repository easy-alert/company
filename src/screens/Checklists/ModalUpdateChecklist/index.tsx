import { useEffect, useState } from 'react';

// LIBS
import { Formik, Form } from 'formik';
import * as yup from 'yup';

// HOOKS
import { useUsersForSelect } from '@hooks/useUsersForSelect';

// SERVICES
import { getChecklists } from '@services/apis/getChecklists';
import { putChecklist } from '@services/apis/putChecklist';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { FormikSelect } from '@components/Form/FormikSelect';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { InputRadio } from '@components/Inputs/InputRadio';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { ReactSelectComponent } from '@components/ReactSelectComponent';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// COMPONENTS
import type { IChecklist } from '@customTypes/IChecklist';

// STYLES
import * as Style from './styles';

interface IModalUpdateChecklist {
  checklistId: string;
  onThenRequest: () => Promise<void>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = yup
  .object({
    id: yup.string(),
    buildingId: yup.string().required('Campo obrigatório.'),
  })
  .required();

type TSchema = yup.InferType<typeof schema>;

type TUpdateMode = 'this' | 'thisAndFollowing' | '';

export const ModalUpdateChecklist = ({
  checklistId,
  onThenRequest,
  setModal,
}: IModalUpdateChecklist) => {
  const [checklistDetails, setChecklistDetails] = useState<IChecklist>({});

  const { usersForSelect } = useUsersForSelect({
    buildingId: checklistDetails.buildingId,
    checkPerms: true,
  });

  const [updateMode, setUpdateMode] = useState<TUpdateMode>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const disableSave = !checklistDetails.checklistUsers?.length || !updateMode;

  const inputs = [
    { id: '1', name: 'mode', value: 'this', label: 'Este checklist' },
    { id: '2', name: 'mode', value: 'thisAndFollowing', label: 'Este e os checklists seguintes' },
  ];

  const handleOnChange = (value: TUpdateMode) => {
    setUpdateMode(value);
  };

  const handleUpdateChecklist = async (values: TSchema) => {
    setOnQuery(true);

    setLoading(true);

    try {
      const selectedUsers = checklistDetails.checklistUsers?.map((user) => user.id) || [];

      await putChecklist({
        updateMode,
        checklistId,
        usersIds: selectedUsers,
      });

      onThenRequest();
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const handleGetChecklist = async () => {
      try {
        const responseData = await getChecklists({ checklistId });

        setChecklistDetails(responseData[0]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (checklistId) {
      handleGetChecklist();
    }
  }, [checklistId]);

  return (
    <Modal setModal={setModal} title="Editar checklist">
      <Style.Container>
        {loading && (
          <Style.LoadingContainer>
            <DotSpinLoading />
          </Style.LoadingContainer>
        )}

        {!loading &&
          !updateMode &&
          inputs.map((input) => (
            <InputRadio
              id={input.id}
              key={input.value}
              value={input.value}
              name={input.name}
              label={input.label}
              checked={updateMode === input.value}
              onChange={(evt) => handleOnChange(evt.target.value as TUpdateMode)}
            />
          ))}

        {!loading && updateMode && (
          <Formik
            initialValues={{
              id: checklistDetails.id,
              buildingId: checklistDetails.buildingId || '',
            }}
            validationSchema={schema}
            onSubmit={async (values: TSchema) => handleUpdateChecklist(values)}
          >
            {({ submitForm }) => (
              <Form>
                <FormikSelect name="buildingId" label="Edifício" disabled>
                  <option value={checklistDetails.buildingId} disabled hidden>
                    {checklistDetails?.building?.name}
                  </option>
                </FormikSelect>

                <ReactSelectComponent
                  id="usersId"
                  name="usersId"
                  label="Usuário(s) *"
                  placeholder="Selecione um ou mais usuários"
                  selectPlaceholderValue={usersForSelect?.length}
                  value={checklistDetails.checklistUsers?.map((user) => ({
                    value: user.id,
                    label: user.name,
                    email: user.email,
                    image: user.image,
                  }))}
                  isMulti
                  options={usersForSelect.map(({ id, name }) => ({ label: name, value: id }))}
                  onChange={(data) => {
                    setChecklistDetails((prev) => ({
                      ...prev,

                      checklistUsers: data.map((user: any) => ({
                        id: user.value,
                        name: user.label,
                        email: user.email,
                        image: user.image,
                      })),
                    }));
                  }}
                />

                <Style.ButtonDiv>
                  <PopoverButton
                    label="Salvar"
                    type="Button"
                    bgColor="primary"
                    actionButtonBgColor={theme.color.actionDanger}
                    loading={onQuery}
                    disabled={onQuery || disableSave}
                    message={{
                      title:
                        updateMode === 'this'
                          ? 'Deseja editar este checklist?'
                          : 'Deseja editar este checklist e os seguintes?',

                      content:
                        updateMode === 'this'
                          ? 'Atenção, somente as informações deste checklist serão editadas. Caso o checklist tenha sido relatado, as informações do relato não serão alteradas.'
                          : 'Atenção, as informações deste checklist e os seguintes serão editadas. Caso o checklist tenha sido relatado, as informações do relato não serão alteradas.',
                      contentColor: theme.color.danger,
                    }}
                    actionButtonClick={submitForm}
                  />
                </Style.ButtonDiv>
              </Form>
            )}
          </Formik>
        )}
      </Style.Container>
    </Modal>
  );
};
