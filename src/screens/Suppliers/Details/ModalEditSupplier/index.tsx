// LIBS
import * as yup from 'yup';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/Buttons/Button';
import { FormikImageInput } from '../../../../components/Form/FormikImageInput';
import { FormikInput } from '../../../../components/Form/FormikInput';
import { Modal } from '../../../../components/Modal';
import {
  applyMask,
  catchHandler,
  convertStateName,
  ensureHttps,
  unMask,
  uploadFile,
} from '../../../../utils/functions';
import * as Style from './styles';
import { Api } from '../../../../services/api';
// eslint-disable-next-line import/no-cycle
import { ISupplier } from '..';
import { ReactSelectComponent } from '../../../../components/ReactSelectComponent';
import { ReactSelectCreatableComponent } from '../../../../components/ReactSelectCreatableComponent';
import { useBrasilCities } from '../../../../hooks/useBrasilCities';
import { useBrasilStates } from '../../../../hooks/useBrasilStates';
import { useAreaOfActivities } from '../../../../hooks/useAreaOfActivities';

interface IModalEditSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
  supplier: ISupplier;
}

export const schemaEditSupplier = yup
  .object({
    image: yup
      .mixed()
      .required('Campo obrigatório.')
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => value.length || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          value.length ||
          (value &&
            (value.type === 'image/png' ||
              value.type === 'image/jpeg' ||
              value.type === 'image/jpg')),
      ),

    name: yup.string().required('Campo obrigatório.'),
    cnpj: yup.string().min(18, 'O CNPJ deve ser válido.'),
    link: yup.string(),
    city: yup.string().required('Campo obrigatório.'),
    state: yup.string().required('Campo obrigatório.'),
    phone: yup.string().min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),
    email: yup.string().email('Informe um e-mail válido'),
    areaOfActivityLabels: yup
      .array()
      .of(yup.string().required('Campo obrigatório.'))
      .min(1, 'Campo obrigatório.')
      .required('Campo obrigatório.'),
  })
  .required();

export const ModalEditSupplier = ({ setModal, onThenRequest, supplier }: IModalEditSupplier) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState('');
  const { states } = useBrasilStates();
  const { cities } = useBrasilCities({ UF: convertStateName(selectedState) });
  const { areaOfActivities } = useAreaOfActivities({ findAll: false });

  return (
    <Modal title="Editar fornecedor" setModal={setModal}>
      <Formik
        initialValues={{
          id: supplier.id,
          image: supplier.image || '',
          name: supplier.name || '',
          link: supplier.link || '',
          phone: supplier.phone ? applyMask({ value: supplier.phone, mask: 'TEL' }).value : '',
          cnpj: supplier.cnpj ? applyMask({ value: supplier.cnpj, mask: 'CNPJ' }).value : '',
          email: supplier.email || '',
          areaOfActivityLabels: supplier.areaOfActivities.map(
            ({ areaOfActivity }) => areaOfActivity.label,
          ),
          city: supplier.city || '',
          state: supplier.state || '',
        }}
        validationSchema={schemaEditSupplier}
        onSubmit={async (data) => {
          setOnQuery(true);

          let imageURL: any;

          if (!data.image.length) {
            const { Location } = await uploadFile(data.image);
            imageURL = Location;
          } else {
            imageURL = data.image;
          }

          await Api.put('/suppliers', {
            ...data,
            image: imageURL,
            phone: data.phone ? unMask(data.phone) : null,
            cnpj: data.cnpj ? unMask(data.cnpj) : null,
            link: data.link ? ensureHttps(data.link) : null,
          })
            .then((res) => {
              onThenRequest();
              setModal(false);
              toast.success(res.data.ServerMessage.message);
            })
            .catch((err) => {
              catchHandler(err);
            })
            .finally(() => {
              setOnQuery(false);
            });
        }}
      >
        {({ errors, values, touched, setFieldValue, setFieldError }) => (
          <Style.FormContainer>
            <Form>
              <FormikImageInput
                name="image"
                label="Imagem/Logo"
                error={touched.image && errors.image ? errors.image : null}
                defaultImage={values.image}
                onChange={(event: any) => {
                  if (event.target.files?.length) {
                    setFieldValue('image', event.target.files[0]);
                  }
                }}
              />

              <FormikInput
                label="Nome *"
                name="name"
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Informe o nome do fornecedor"
              />

              <FormikInput
                name="cnpj"
                label="CNPJ"
                maxLength={applyMask({ value: values.cnpj, mask: 'CNPJ' }).length}
                error={touched.cnpj && errors.cnpj ? errors.cnpj : null}
                placeholder="00.000.000/0000-00"
                onChange={(e) => {
                  setFieldValue('cnpj', applyMask({ value: e.target.value, mask: 'CNPJ' }).value);
                }}
              />

              <FormikInput
                label="E-mail"
                name="email"
                error={touched.email && errors.email ? errors.email : null}
                placeholder="Informe o email"
              />

              <FormikInput
                label="Telefone/Celular"
                name="phone"
                maxLength={15}
                error={touched.phone && errors.phone ? errors.phone : null}
                placeholder="Ex: (00) 00000-0000"
                onChange={(e) => {
                  setFieldValue('phone', applyMask({ value: e.target.value, mask: 'TEL' }).value);
                }}
              />

              <ReactSelectCreatableComponent
                selectPlaceholderValue={values.areaOfActivityLabels.length}
                isMulti
                id="areaOfActivity"
                name="areaOfActivity"
                placeholder="Selecione ou digite para criar"
                label="Área de atuação *"
                options={areaOfActivities.map(({ label }) => ({
                  label,
                  value: label,
                }))}
                onChange={(data) => {
                  const areaOfActivityLabels = data.map(({ label }: { label: string }) => label);
                  setFieldValue('areaOfActivityLabels', areaOfActivityLabels);
                  setFieldError('areaOfActivityLabels', '');
                }}
                defaultValue={supplier.areaOfActivities.map((data) => ({
                  label: data.areaOfActivity.label,
                  value: data.areaOfActivity.label,
                }))}
                error={
                  touched.areaOfActivityLabels && errors.areaOfActivityLabels
                    ? errors.areaOfActivityLabels
                    : null
                }
              />

              <ReactSelectComponent
                selectPlaceholderValue={values.state}
                label="Estado *"
                id="state"
                name="state"
                options={states.map(({ nome }) => ({
                  label: nome,
                  value: nome,
                }))}
                placeholder="Selecione"
                value={
                  values.state
                    ? {
                        label: values.state,
                        value: values.state,
                      }
                    : []
                }
                onChange={(evt) => {
                  setSelectedState(evt.value);
                  setFieldValue('state', evt.value);
                  setFieldError('state', '');
                  setFieldValue('city', '');
                }}
                error={touched.state && errors.state ? errors.state : null}
              />

              <ReactSelectComponent
                selectPlaceholderValue={values.city}
                label="Cidade *"
                id="city"
                name="city"
                options={cities.map(({ nome }) => ({
                  label: nome,
                  value: nome,
                }))}
                value={
                  values.city
                    ? {
                        label: values.city,
                        value: values.city,
                      }
                    : []
                }
                placeholder="Selecione"
                onChange={(evt) => {
                  setFieldValue('city', evt.value);
                  setFieldError('city', '');
                }}
                error={touched.city && errors.city ? errors.city : null}
              />

              <FormikInput
                label="Link"
                name="link"
                error={touched.link && errors.link ? errors.link : null}
                placeholder="Ex: www.easyalert.com.br"
              />

              <Button center label="Salvar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
