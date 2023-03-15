// LIBS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

// COMPONENTS
import { Api } from '../../../services/api';
import { Button } from '../../../components/Buttons/Button';
import { FormikInput } from '../../../components/Form/FormikInput';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

// ICONS
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { changePasswordSchema } from './functions';

// TYPES
import { catchHandler } from '../../../utils/functions';

export const RecoverPassword = () => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Style.Background>
      <Formik
        initialValues={{ newPassword: '', newPasswordConfirm: '' }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values) => {
          setOnQuery(true);
          await Api.post('/BLABLABL', {
            email: values.newPassword,
          })
            .then(() => {
              navigate('/login');
            })
            .catch((err) => {
              setOnQuery(false);
              catchHandler(err);
            });
        }}
      >
        {({ errors, values, touched }) => (
          <>
            <img src={icon.logoTextWhite} alt="" />
            <Style.LoginContainer>
              <Form>
                <Style.InputWrapper>
                  <h2>Alterar senha</h2>
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    name="newPassword"
                    label="Nova senha"
                    placeholder="Informe a nova senha"
                    value={values.newPassword}
                    error={touched.newPassword && errors.newPassword ? errors.newPassword : null}
                  />
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    name="newPasswordConfirm"
                    label="Confirmar nova senha"
                    placeholder="Confirme a nova senha"
                    value={values.newPasswordConfirm}
                    error={
                      touched.newPasswordConfirm && errors.newPasswordConfirm
                        ? errors.newPasswordConfirm
                        : null
                    }
                  />
                </Style.InputWrapper>
                <Button center label="Enviar" loading={onQuery} type="submit" />
              </Form>
            </Style.LoginContainer>
          </>
        )}
      </Formik>
    </Style.Background>
  );
};
