// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES

// COMPONENTS
import { ErrorMessage, InputContainer, CheckboxWrapper } from './styles';
import { theme } from '../../../styles/theme';
import { IInput } from './types';

const InputCheckboxBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray5,
    errorColor = theme.color.danger,
    name,
    error,
    disable = false,
    size = '16px',
    id,
    justifyContent = 'flex-start',
    ...rest
  },
  ref,
) => (
  <InputContainer error={!!error} justifyContent={justifyContent}>
    <CheckboxWrapper disable={disable} labelColor={labelColor} size={size}>
      <input type="checkbox" id={id} name={name} ref={ref} {...rest} disabled={disable} />

      {label && <label htmlFor={id}>{label}</label>}
    </CheckboxWrapper>
    <ErrorMessage errorColor={errorColor}>{!!error && <p className="p3">{error}</p>}</ErrorMessage>
  </InputContainer>
);
export const InputCheckbox = forwardRef(InputCheckboxBase);
