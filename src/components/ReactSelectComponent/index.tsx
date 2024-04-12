import Select from 'react-select';
import { IReactSelectComponent } from './types';
import * as Style from './styles';
import { theme } from '../../styles/theme';

const customStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    cursor: 'pointer',
    border: `1px solid ${theme.color.gray4}`,
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: `1px solid ${theme.color.gray4}`,
    },
    padding: 0,
    margin: 0,
  }),
  menu: (base: any) => ({
    ...base,
    marginTop: 2,
  }),

  option: (base: any) => ({
    ...base,
    cursor: 'pointer',
    paddingLeft: '16px',
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: 0,
    paddingLeft: '13px',
  }),

  input: (base: any) => ({
    ...base,
    padding: 0,
    margin: 0,
    paddingLeft: '3px',
  }),

  placeholder: (base: any) => ({
    ...base,
    padding: 0,
    margin: 0,
    paddingLeft: '3px',
  }),
};

export const ReactSelectComponent = ({
  maxMenuHeight = 250,
  noOptionsMessage = () => 'Sem resultados',
  isDisabled,
  label,
  id,
  name,
  onChange,
  options,
  placeholder,
  isClearable = true,
  isMulti = false,
  value,
  isOptionDisabled,
  newCustomStyle,
  defaultValue,
  error,
}: IReactSelectComponent) => (
  <Style.ReactSelectDiv>
    {label && <h6>{label}</h6>}
    <Select
      isMulti={isMulti}
      value={value}
      isDisabled={isDisabled}
      name={name}
      id={id}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={newCustomStyle || customStyles}
      noOptionsMessage={noOptionsMessage}
      maxMenuHeight={maxMenuHeight}
      options={options}
      onChange={onChange}
      isOptionDisabled={isOptionDisabled}
      defaultValue={defaultValue}
    />
    {!!error && (
      <Style.ErrorMessage>
        <p className="p3">{error}</p>
      </Style.ErrorMessage>
    )}
  </Style.ReactSelectDiv>
);
