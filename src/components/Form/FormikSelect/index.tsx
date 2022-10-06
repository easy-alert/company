// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Field } from 'formik';

// TYPES
import { SelectProps } from './utils/types';

// COMPONENTS
import { ErrorMessage, SelectContainer } from './styles';

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { label, name, error, selectPlaceholderValue = '', ...rest },
  ref,
) => (
  <SelectContainer error={!!error} selectPlaceholderValue={selectPlaceholderValue}>
    <h6>{label}</h6>
    <Field as="select" id={name} name={name} ref={ref} {...rest} />
    <ErrorMessage>{!!error && <p className="p3">{error}</p>}</ErrorMessage>
  </SelectContainer>
);
export const FormikSelect = forwardRef(SelectBase);
