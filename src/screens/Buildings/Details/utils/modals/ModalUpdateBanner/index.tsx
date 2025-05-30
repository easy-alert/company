import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../components/Modal';
import { Api } from '../../../../../../services/api';
import { catchHandler, uploadFile } from '../../../../../../utils/functions';
import { DragAndDropFiles } from '../../../../../../components/DragAndDropFiles';
import { ImageComponent } from '../../../../../../components/ImageComponent';
import { IBanner } from '../../types';

interface IModalUpdateBanner {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
  selectedBanner: IBanner;
}

const schema = yup
  .object({
    originalName: yup.string().required('Campo obrigatório.'),
    redirectUrl: yup.string().nullable(),
    id: yup.string(),
    url: yup.string().required('Campo obrigatório.'),
  })
  .required();

type TFormData = yup.InferType<typeof schema>;

export const ModalUpdateBanner = ({
  setModal,
  onThenRequest,
  selectedBanner,
}: IModalUpdateBanner) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);

  return (
    <Modal setModal={setModal} title="Atualizar banner">
      <Formik
        initialValues={selectedBanner}
        validationSchema={schema}
        onSubmit={async (values: TFormData) => {
          const { redirectUrl } = values;

          if (
            redirectUrl &&
            !redirectUrl.startsWith('www.') &&
            !redirectUrl.startsWith('https://') &&
            !redirectUrl.startsWith('http://') &&
            !redirectUrl.startsWith('//')
          ) {
            toast.error(
              <div>
                Informe um link válido.
                <br />
                Ex: www.easyalert.com.br
              </div>,
            );
            return;
          }

          // eslint-disable-next-line no-nested-ternary
          const formattedRedirectUrl = redirectUrl
            ? redirectUrl.startsWith('https://') || redirectUrl.startsWith('http://')
              ? redirectUrl
              : `https://${redirectUrl}`
            : '';

          setOnQuery(true);

          await Api.put(`/buildings/banners/update`, {
            ...values,
            redirectUrl: formattedRedirectUrl,
          })
            .then((res) => {
              setModal(false);
              onThenRequest();
              toast.success(res.data.ServerMessage.message);
            })
            .catch((err) => {
              catchHandler(err);
            });

          setOnQuery(false);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <FormikInput
              name="redirectUrl"
              label="Link do banner"
              placeholder="Ex: www.easyalert.com.br"
              error={touched.redirectUrl && (errors.redirectUrl || null)}
            />

            <DragAndDropFiles
              loading={onFileQuery}
              error={touched.url && (errors.url || null)}
              showMessage
              multiple={false}
              onlyImages
              label="Banner *"
              getAcceptedFiles={async ({ acceptedFiles }) => {
                setOnFileQuery(true);
                setFieldValue('url', '');
                const { Location, originalname } = await uploadFile(acceptedFiles[0]);
                setOnFileQuery(false);

                setFieldValue('url', Location);
                setFieldValue('originalName', originalname);
              }}
            />

            {values.url && <ImageComponent src={values.url} width="100%" height="200px" />}

            <Button
              style={{ marginTop: '8px' }}
              center
              label="Salvar"
              type="submit"
              loading={onQuery}
              disable={onFileQuery}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
