// LIBS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

// COMPONENTS
import { toast } from 'react-toastify';
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
import { catchHandler, query } from '../../../utils/functions';

export const RecoverPassword = () => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const token = query.get('token');

  return (
    <Style.Background>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values) => {
          setOnQuery(true);
          await Api.put('/passwordrecovery/change', {
            token,
            password: values.password,
          })
            .then((res) => {
              toast.success(res.data.ServerMessage.message);
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
                    name="password"
                    type="password"
                    label="Nova senha"
                    placeholder="Informe a nova senha"
                    value={values.password}
                    error={touched.password && errors.password ? errors.password : null}
                  />
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    name="confirmPassword"
                    type="password"
                    label="Confirmar nova senha"
                    placeholder="Confirme a nova senha"
                    value={values.confirmPassword}
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
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
