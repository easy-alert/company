import Select from 'react-select/creatable';
import * as RSComponents from 'react-select';
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
  onCreateOption,
  onDeleteOption,
  options,
  placeholder,
  isClearable = false,
  isMulti = false,
  value,
  isOptionDisabled,
  newCustomStyle,
  defaultValue,
  error,
  selectPlaceholderValue,
}: IReactSelectCreatableComponent) => (
  <Style.ReactSelectDiv selectPlaceholderValue={selectPlaceholderValue}>
    {label && <h6>{label}</h6>}
    <Style.Row>
      <div style={{ flex: 1 }}>
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
          onCreateOption={onCreateOption}
          isOptionDisabled={isOptionDisabled}
          formatCreateLabel={(data) => `Criar "${data}"`}
          components={onDeleteOption ? {
            Option: (props: any) => {
              const { data } = props;
              return (
                <RSComponents.components.Option {...props}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{data.label}</span>
                    {data.companyId ? (
                      <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteOption && onDeleteOption({ label: data.label, value: data.value });
                      }}
                      title="Excluir opção"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 0,
                        marginLeft: 8,
                      }}
                    >
                      🗑️
                    </button>
                    ) : null}
                  </div>
                </RSComponents.components.Option>
              );
            },
          } : undefined}
        />
      </div>
    </Style.Row>
    {!!error && (
      <Style.ErrorMessage>
        <p className="p3">{error}</p>
      </Style.ErrorMessage>
    )}
  </Style.ReactSelectDiv>
);
