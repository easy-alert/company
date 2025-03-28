import Select from 'react-select';

import { theme as defaultTheme } from '@styles/theme';

import * as Style from './styles';

import type { IReactSelectComponent } from './types';

const customStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    cursor: 'pointer',
    border: `1px solid ${defaultTheme.color.gray4}`,
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: `1px solid ${defaultTheme.color.gray4}`,
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

  dropdownIndicator: (base: any) => ({
    ...base,

    width: 35,
    marginRight: 1.5,

    svg: {
      ...base.svg,
      color: defaultTheme.color.primary, // Only changes the arrow icon
    },
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
  isClearable = false,
  isMulti = false,
  value,
  isOptionDisabled,
  newCustomStyle,
  defaultValue,
  error,
  inputValue,
  selectPlaceholderValue,
}: IReactSelectComponent) => (
  <Style.ReactSelectDiv selectPlaceholderValue={selectPlaceholderValue}>
    {label && <h6>{label}</h6>}

    <Select
      inputValue={inputValue}
      isMulti={isMulti}
      value={value}
      isDisabled={isDisabled}
      name={name}
      id={id}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={newCustomStyle || customStyles}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: defaultTheme.color.primary,
          primary25: defaultTheme.color.primaryL,
          primary50: defaultTheme.color.primaryM,
          primary75: defaultTheme.color.primaryM,
        },
      })}
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
