// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
// TYPES
import { IInput } from './utils/types';
// COMPONENTS
import { InputContainer } from './styles';

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { label, name, type = 'text', typeDatePlaceholderValue, ...rest },
  ref,
) => (
  <InputContainer typeDatePlaceholderValue={typeDatePlaceholderValue} type={type}>
    <h6>{label}</h6>
    <input id={name} type={type} name={name} ref={ref} {...rest} />
  </InputContainer>
);
export const Input = forwardRef(InputBase);
