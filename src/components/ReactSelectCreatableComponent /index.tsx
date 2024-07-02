import Select from 'react-select/creatable';
import { IReactSelectCreatableComponent } from './types';
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
    zIndex: 999,
  }),

  valueContainer: (base: any) => ({
    ...base,
    paddingLeft: '14px',
  }),
};

export const ReactSelectCreatableComponent = ({
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
}: IReactSelectCreatableComponent) => (
  <Style.ReactSelectDiv>
    {label && <p className="p5">{label}</p>}
    <Select
      defaultValue={defaultValue}
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
      formatCreateLabel={(data) => `Criar "${data}"`}
    />
    {!!error && (
      <Style.ErrorMessage>
        <p className="p9">{error}</p>
      </Style.ErrorMessage>
    )}
  </Style.ReactSelectDiv>
);
