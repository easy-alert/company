// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Field } from 'formik';

// TYPES
import { TextAreaProps } from './utils/types';
// COMPONENTS
import { ErrorMessage, TextAreaContainer } from './styles';

const TextAreaBase: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  { label, name, error, height = '100px', ...rest },
  ref,
) => (
  <TextAreaContainer error={!!error} height={height}>
    {label && <h6>{label}</h6>}
    <Field as="textarea" id={name} name={name} ref={ref} {...rest} />
    <ErrorMessage>{!!error && <p className="p3">{error}</p>}</ErrorMessage>
  </TextAreaContainer>
);
export const FormikTextArea = forwardRef(TextAreaBase);
