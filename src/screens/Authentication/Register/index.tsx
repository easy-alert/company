// LIBS
import { useState } from 'react';
import { Formik, Form } from 'formik';

// COMPONENTS
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Buttons/Button';
import { FormikInput } from '../../../components/Form/FormikInput';
import { FormikImageInput } from '../../../components/Form/FormikImageInput';
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { requestCreateCompanyAndOWner, schemaModalCreateCompanyAndOwner } from './functions';
import { applyMask } from '../../../utils/functions';
import { IconButton } from '../../../components/Buttons/IconButton';

export const Register = () => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signin } = useAuthContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);

  return (
    <Style.Background>
      <Formik
        initialValues={{
          image: '',
          name: '',
          email: '',
          companyName: '',
          contactNumber: '',
          CNPJorCPF: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={schemaModalCreateCompanyAndOwner}
        onSubmit={async (values) => {
          setShowPassword(false);
          setShowPassword2(false);
          await requestCreateCompanyAndOWner({ setOnQuery, values, navigate, signin });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <>
            <img src={icon.logoTextWhite} alt="" />

            <Style.LoginContainer>
              <Form>
                <Style.InputWrapper>
                  <FormikImageInput
                    customAddLogo={icon.plusWhite}
                    customEditLogo={icon.editWhite}
                    name="image"
                    label="Logo"
                    error={touched.image && errors.image ? errors.image : null}
                    defaultImage={values.image}
                    onChange={(event: any) => {
                      if (event.target.files?.length) {
                        setFieldValue('image', event.target.files[0]);
                      }
                    }}
                  />
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    label="Nome do responsável"
                    name="name"
                    value={values.name}
                    error={touched.name && errors.name ? errors.name : null}
                    placeholder="Ex: João Silva"
                    maxLength={40}
                  />
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    label="E-mail"
                    name="email"
                    value={values.email}
                    error={touched.email && errors.email ? errors.email : null}
                    placeholder="Ex:  joao.silva@easyalert.com"
                    maxLength={40}
                  />
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    label="Nome da empresa"
                    name="companyName"
                    value={values.companyName}
                    error={touched.companyName && errors.companyName ? errors.companyName : null}
                    placeholder="Ex: SATC"
                    maxLength={40}
                  />

                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    label="Telefone"
                    name="contactNumber"
                    maxLength={
                      applyMask({
                        value: values.contactNumber,
                        mask: 'TEL',
                      }).length
                    }
                    value={values.contactNumber}
                    error={
                      touched.contactNumber && errors.contactNumber ? errors.contactNumber : null
                    }
                    placeholder="Ex: (00) 00000-0000"
                    onChange={(e) => {
                      setFieldValue(
                        'contactNumber',
                        applyMask({ value: e.target.value, mask: 'TEL' }).value,
                      );
                    }}
                  />

                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    label="CNPJ/CPF"
                    name="CNPJorCPF"
                    placeholder="Insira o CNPJ ou CPF"
                    error={touched.CNPJorCPF && errors.CNPJorCPF ? errors.CNPJorCPF : null}
                    maxLength={
                      applyMask({
                        mask: 'CNPJ',
                        value: values.CNPJorCPF,
                      }).length
                    }
                    onChange={(e) => {
                      setFieldValue(
                        'CNPJorCPF',
                        applyMask({
                          mask: e.target.value.length > 14 ? 'CNPJ' : 'CPF',
                          value: e.target.value,
                        }).value,
                      );
                    }}
                  />

                  <Style.PasswordDiv>
                    <FormikInput
                      labelColor={theme.color.white}
                      errorColor={theme.color.white}
                      type={showPassword ? 'text' : 'password'}
                      label="Senha"
                      name="password"
                      value={values.password}
                      error={touched.password && errors.password ? errors.password : null}
                      placeholder="Informe a senha"
                      maxLength={120}
                    />
                    <IconButton
                      icon={showPassword ? icon.eye : icon.eyeGray}
                      size="20px"
                      onClick={() => {
                        setShowPassword((prevState) => !prevState);
                      }}
                      opacity="1"
                    />
                  </Style.PasswordDiv>

                  <Style.PasswordDiv>
                    <FormikInput
                      labelColor={theme.color.white}
                      errorColor={theme.color.white}
                      type={showPassword2 ? 'text' : 'password'}
                      label="Confirmar senha"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      error={
                        touched.confirmPassword && errors.confirmPassword
                          ? errors.confirmPassword
                          : null
                      }
                      placeholder="Confirme a senha"
                      maxLength={120}
                    />
                    <IconButton
                      icon={showPassword2 ? icon.eye : icon.eyeGray}
                      size="20px"
                      onClick={() => {
                        setShowPassword2((prevState) => !prevState);
                      }}
                      opacity="1"
                    />
                  </Style.PasswordDiv>
                </Style.InputWrapper>
                <Button center label="Cadastrar" type="submit" loading={onQuery} />
              </Form>
            </Style.LoginContainer>
            <p className="p2">
              Já possui conta? <Link to="/login">Faça login</Link>
            </p>
          </>
        )}
      </Formik>
    </Style.Background>
  );
};
