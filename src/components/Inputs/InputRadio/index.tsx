// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES
import { IInput } from './utils/types';

// COMPONENTS
import { ErrorMessage, InputContainer, CheckboxWrapper } from './styles';
import { theme } from '../../../styles/theme';

const RadioBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray5,
    errorColor = theme.color.danger,
    name,
    error,
    disable = false,
    id,
    ...rest
  },
  ref,
) => (
  <InputContainer error={!!error}>
    <CheckboxWrapper disable={disable} labelColor={labelColor}>
      <input type="radio" id={id} name={name} ref={ref} {...rest} disabled={disable} />
      <label htmlFor={id}>{label}</label>
    </CheckboxWrapper>
    <ErrorMessage errorColor={errorColor}>{!!error && <p className="p3">{error}</p>}</ErrorMessage>
  </InputContainer>
);
export const InputRadio = forwardRef(RadioBase);
