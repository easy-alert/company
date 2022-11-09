// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Field } from 'formik';

// TYPES
import { IInput } from './utils/types';

// COMPONENTS
import { ErrorMessage, InputContainer } from './styles';
import { theme } from '../../../styles/theme';

const FormikInputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray5,
    errorColor = theme.color.danger,
    name,
    error,
    max,
    type = 'text',
    passwordPlaceholder,
    typeDatePlaceholderValue,
    ...rest
  },
  ref,
) => (
  <InputContainer
    error={!!error}
    passwordPlaceholder={passwordPlaceholder}
    labelColor={labelColor}
    typeDatePlaceholderValue={typeDatePlaceholderValue}
    type={type}
  >
    {label && <h6>{label}</h6>}
    <Field
      max={type === 'date' && !max ? '9999-12-31' : max}
      type={type}
      id={name}
      name={name}
      ref={ref}
      {...rest}
    />
    <ErrorMessage errorColor={errorColor}>{!!error && <p className="p3">{error}</p>}</ErrorMessage>
  </InputContainer>
);
export const FormikInput = forwardRef(FormikInputBase);
