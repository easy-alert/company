// LIBS
import * as yup from 'yup';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/Buttons/Button';
import { FormikImageInput } from '../../../../components/Form/FormikImageInput';
import { FormikInput } from '../../../../components/Form/FormikInput';
import { Modal } from '../../../../components/Modal';
import { applyMask, catchHandler, unMask, uploadFile } from '../../../../utils/functions';
import * as Style from './styles';
import { Api } from '../../../../services/api';
// eslint-disable-next-line import/no-cycle
import { ISupplier } from '..';

interface IModalEditSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
  supplier: ISupplier;
}

export const schemaEditSupplier = yup
  .object({
    image: yup
      .mixed()
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
    cnpj: yup.string().required('O cnpj deve ser preenchido.').min(18, 'O cnpj deve ser válido.'),
    link: yup.string().required('Campo obrigatório.'),
    phone: yup.string().min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),
    email: yup.string().email('Informe um e-mail válido'),
  })
  .required();

export const ModalEditSupplier = ({ setModal, onThenRequest, supplier }: IModalEditSupplier) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar fornecedor" setModal={setModal}>
      <Formik
        initialValues={{
          id: supplier.id,
          name: supplier.name,
          image: supplier.image,
          link: supplier.link,
          email: supplier.email || '',
          phone: supplier.phone ? applyMask({ mask: 'TEL', value: supplier.phone }).value : '',
          cnpj: supplier.cnpj ? applyMask({ mask: 'TEL', value: supplier.cnpj }).value : '',
        }}
        validationSchema={schemaEditSupplier}
        onSubmit={async (data) => {
          // const URLValid = isURLValid(data.link);
          // if (!URLValid) {
          //   toast.error(
          //     <div>
          //       Informe um link válido.
          //       <br />
          //       Ex: www.easyalert.com.br
          //     </div>,
          //   );
          //   return;
          // }

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
            phone: unMask(data.phone),
            link: data.link,
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
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <FormikImageInput
                name="image"
                label="Imagem/Logo *"
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
                value={values.name}
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Ex: João Silva"
              />

              <FormikInput
                name="cnpj"
                label="cnpj"
                maxLength={applyMask({ value: values.cnpj, mask: 'CNPJ' }).length}
                value={values.cnpj}
                error={touched.cnpj && errors.cnpj ? errors.cnpj : null}
                placeholder="00.000.000/0000-00"
                onChange={(e) => {
                  setFieldValue('cnpj', applyMask({ value: e.target.value, mask: 'CNPJ' }).value);
                }}
              />

              <FormikInput
                label="Link *"
                name="link"
                value={values.link}
                error={touched.link && errors.link ? errors.link : null}
                placeholder="Ex: www.easyalert.com.br"
              />

              <FormikInput
                label="E-mail"
                name="email"
                value={values.email}
                error={touched.email && errors.email ? errors.email : null}
                placeholder="Informe o email"
              />

              <FormikInput
                label="Telefone/Celular"
                name="phone"
                maxLength={
                  applyMask({
                    value: values.phone,
                    mask: 'TEL',
                  }).length
                }
                value={values.phone}
                error={touched.phone && errors.phone ? errors.phone : null}
                placeholder="Ex: (00) 00000-0000"
                onChange={(e) => {
                  setFieldValue('phone', applyMask({ value: e.target.value, mask: 'TEL' }).value);
                }}
              />

              <Button center label="Salvar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
