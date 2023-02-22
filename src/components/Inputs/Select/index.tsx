// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
// TYPES
import { ISelect } from './utils/types';
// COMPONENTS
import { SelectContainer } from './styles';

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, ISelect> = (
  { label, name, selectPlaceholderValue = '', ...rest },
  ref,
) => (
  <SelectContainer selectPlaceholderValue={selectPlaceholderValue}>
    <h6>{label}</h6>
    <select id={name} name={name} ref={ref} {...rest} />
  </SelectContainer>
);
export const Select = forwardRef(SelectBase);
