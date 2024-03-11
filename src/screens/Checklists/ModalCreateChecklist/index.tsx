import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import * as Style from './styles';
import { Modal } from '../../../components/Modal';
import { ITimeInterval } from '../../../utils/types';
import { Button } from '../../../components/Buttons/Button';
import { FormikInput } from '../../../components/Form/FormikInput';
import { Api } from '../../../services/api';
import { applyMask, capitalizeFirstLetter, catchHandler } from '../../../utils/functions';
import { FormikSelect } from '../../../components/Form/FormikSelect';
import { Input } from '../../../components/Inputs/Input';
import { FormikCheckbox } from '../../../components/Form/FormikCheckbox';
import { FormikTextArea } from '../../../components/Form/FormikTextArea';

interface IModalCreateChecklist {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  timeIntervals: ITimeInterval[];
  buildingId: string;
  buildingName: string;
  onThenRequest: () => Promise<void>;
}

const schema = yup
  .object({
    buildingId: yup.string().required('Campo obrigatório.'),
    name: yup.string().required('Campo obrigatório.'),
    syndicId: yup.string().required('Campo obrigatório.'),
    description: yup.string(),
    date: yup.string().required('Campo obrigatório.'),

    hasFrequency: yup.boolean(),

    frequency: yup
      .string()
      .matches(/^\d/, 'O prazo para execução deve ser um número.')
      .when('hasFrequency', {
        is: (hasFrequency: boolean) => hasFrequency,
        then: yup
          .string()
          .matches(/^\d/, 'O prazo para execução deve ser um número.')
          .required('Campo obrigatório.'),
      }),
    frequencyTimeIntervalId: yup.string().required('Campo obrigatório.'),
  })
  .required();

type TSchema = yup.InferType<typeof schema>;

export const ModalCreateChecklist = ({
  setModal,
  timeIntervals,
  onThenRequest,
  buildingId,
  buildingName,
}: IModalCreateChecklist) => {
  const [syndics, setSyndics] = useState<{ name: string; id: string }[]>([]);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const listSyndics = async () => {
    await Api.get(`/buildings/notifications/list-for-select/${buildingId}`)
      .then((res) => {
        setSyndics(res.data.syndics);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    listSyndics();
  }, []);

  return (
    <Modal setModal={setModal} title="Cadastrar checklist">
      <Style.Container>
        <Formik
          initialValues={{
            name: '',
            buildingId,
            date: '',
            frequency: '',
            frequencyTimeIntervalId: timeIntervals[0].id,
            description: '',
            syndicId: '',
            hasFrequency: false,
          }}
          validationSchema={schema}
          onSubmit={async (values: TSchema) => {
            setOnQuery(true);

            await Api.post(`/checklists`, {
              ...values,
              frequency: values.frequency ? Number(values.frequency) : null,
            })
              .then((res) => {
                onThenRequest();
                toast.success(res.data.ServerMessage.message);
                setModal(false);
              })
              .catch((err) => {
                catchHandler(err);
              })
              .finally(() => {
                setOnQuery(false);
              });
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Input
                name="buildingName"
                label="Edificação *"
                defaultValue={buildingName}
                disabled
              />

              <FormikInput
                name="name"
                label="Nome *"
                placeholder="Ex: Retirar o lixo"
                maxLength={200}
                error={touched.name && (errors.name || null)}
              />

              <FormikSelect
                name="syndicId"
                selectPlaceholderValue={values.syndicId}
                label="Responsável *"
                error={touched.syndicId && (errors.syndicId || null)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                {syndics.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </FormikSelect>

              <FormikTextArea
                label="Descrição"
                placeholder="Insira a descrição"
                name="description"
                maxLength={200}
                error={touched.description && (errors.description || null)}
              />

              <FormikInput
                name="date"
                label="Data *"
                type="date"
                error={touched.date && (errors.date || null)}
              />

              <FormikCheckbox
                label="Periodicidade"
                name="hasFrequency"
                onChange={() => {
                  setFieldValue('hasFrequency', !values.hasFrequency);
                  setFieldValue('frequency', '');
                }}
              />

              {values.hasFrequency && (
                <Style.FrequencyWrapper>
                  <FormikInput
                    name="frequency"
                    label="Periodicidade *"
                    placeholder="Ex: 2"
                    maxLength={4}
                    error={touched.frequency && (errors.frequency || null)}
                    onChange={(e) => {
                      setFieldValue(
                        'frequency',
                        applyMask({ mask: 'NUM', value: e.target.value }).value,
                      );
                    }}
                  />
                  <FormikSelect
                    name="frequencyTimeIntervalId"
                    selectPlaceholderValue={values.frequencyTimeIntervalId}
                    label="Unidade *"
                  >
                    {timeIntervals.map(({ id, pluralLabel, singularLabel }) => (
                      <option value={id} key={id}>
                        {Number(values.frequency) > 1
                          ? capitalizeFirstLetter(pluralLabel)
                          : capitalizeFirstLetter(singularLabel)}
                      </option>
                    ))}
                  </FormikSelect>
                </Style.FrequencyWrapper>
              )}

              <Button center label="Cadastrar" type="submit" loading={onQuery} />
            </Form>
          )}
        </Formik>
      </Style.Container>
    </Modal>
  );
};
