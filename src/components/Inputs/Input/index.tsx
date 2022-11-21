// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
// TYPES
import { IInput } from './utils/types';
// COMPONENTS
import { InputContainer } from './styles';

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { label, name, ...rest },
  ref,
) => (
  <InputContainer>
    <h6>{label}</h6>
    <input id={name} name={name} ref={ref} {...rest} />
  </InputContainer>
);
export const Input = forwardRef(InputBase);
