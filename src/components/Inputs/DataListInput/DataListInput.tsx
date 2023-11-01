import { useEffect, useRef, useState, KeyboardEvent as KeyboardType } from 'react';

import * as s from './styles';

import { Option } from './Option';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../Buttons/IconButton';

// #region TYPES
interface IOptions {
  label: string;
  extraLabel: string;
  value: string;
  disabled?: boolean;
}

interface IDataListInput {
  name?: string;
  error?: any;

  initialInputValue?: string;

  placeholder?: string;

  disabled?: boolean;

  label?: string;

  maxLength?: number;

  getValue: ({ value }: { value: string }) => void;
  getValueOnChange: ({ value }: { value: string }) => void;

  options: IOptions[];

  removeStyles?: boolean;
}

// #endregion

export function DataListInput({
  error,
  name = 'dataListInput',
  getValue,
  options,
  label,
  placeholder,
  maxLength = 100,
  removeStyles,
  initialInputValue,
  disabled,
  getValueOnChange,
}: IDataListInput) {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(initialInputValue || '');

  const [visibleOptions, setVisibleOptions] = useState(false);
  const [focusedElement, setFocusedElement] = useState<number>(0);
  const [filteredOptions, setFilteredOptions] = useState<IOptions[]>(options);

  // #region CONTROLLERS
  function preventArrowKeys(evt: KeyboardType) {
    if (evt.key === 'Enter' || evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
      evt.preventDefault();
    }
  }

  useEffect(() => {
    if (!visibleOptions) return setFocusedElement(0);

    if (filteredOptions.length === 0) {
      setFocusedElement(-1);
    }

    async function handleKeyDown(evt: KeyboardEvent) {
      if (evt.key === 'ArrowUp') {
        setFocusedElement((prevState) => {
          if (prevState - 1 >= 0) {
            return prevState - 1;
          }

          return prevState;
        });
      }

      if (evt.key === 'ArrowDown') {
        if (focusedElement <= filteredOptions.length) {
          setFocusedElement((prevState) => {
            if (filteredOptions.length - 1 >= prevState + 1) {
              return prevState + 1;
            }

            return prevState;
          });
        }
      }

      if (evt.key === 'Escape') {
        setVisibleOptions(false);
      }

      if (evt.key === 'Enter') {
        const option = filteredOptions[focusedElement];

        if (option && !option.disabled) {
          setInputValue(option.label);
          getValue({ value: option.value });
          return setVisibleOptions(false);
        }
      }

      return undefined;
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    visibleOptions,
    filteredOptions,
    focusedElement,
    getValue,
    setVisibleOptions,
    setFocusedElement,
  ]);

  useEffect(() => {
    const handleClick = (event: any) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setVisibleOptions(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  //  FILTER
  useEffect(() => {
    setFilteredOptions(() => {
      let newOptions = options;

      if (!inputValue) return newOptions;

      if (inputValue === '') {
        return newOptions;
      }

      newOptions = options.filter(
        (option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.extraLabel.toLowerCase().includes(inputValue.toLowerCase()),
      );

      return newOptions;
    });
  }, [inputValue, options]);

  // #endregion

  return (
    <s.RootContainer ref={divRef}>
      {label && <h6>{label}</h6>}
      <s.RootInputContainer error={!!error} removeStyles={removeStyles}>
        <input
          disabled={disabled}
          id={name}
          name={name}
          ref={inputRef}
          readOnly={!visibleOptions}
          placeholder={placeholder || 'Selecione'}
          maxLength={maxLength}
          value={inputValue}
          onClick={() => {
            setVisibleOptions(true);
          }}
          onChange={(evt) => {
            const onChangeValue = evt.target.value;
            getValueOnChange({ value: onChangeValue });

            if (!onChangeValue) getValue({ value: '' });

            if (onChangeValue.startsWith(' ')) return;

            if (onChangeValue.endsWith('  ')) return;

            setInputValue(onChangeValue);
          }}
          onKeyDown={(evt) => preventArrowKeys(evt)}
        />

        {inputValue ? (
          <s.RootResetValueContainer>
            <IconButton
              disabled={disabled}
              icon={icon.trash}
              size="22px"
              onClick={(evt) => {
                evt.stopPropagation();
                setInputValue('');
                getValue({ value: '' });
              }}
            />
          </s.RootResetValueContainer>
        ) : (
          <s.RootDownArrowContainer>
            <IconButton
              disabled={disabled}
              icon={icon.downArrow}
              size="16px"
              onClick={(evt) => {
                evt.stopPropagation();
                setVisibleOptions(true);
              }}
            />
          </s.RootDownArrowContainer>
        )}
      </s.RootInputContainer>
      {!!error && !visibleOptions && (
        <s.RootErrorMessage>
          <p className="p3">{error}</p>
        </s.RootErrorMessage>
      )}

      {visibleOptions && (
        <s.OptionsContainer>
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option, i) => (
                <Option
                  disabled={option.disabled}
                  key={option.value}
                  label={option.label}
                  extraLabel={option.extraLabel}
                  focused={focusedElement === i}
                  onMouseEnter={() => setFocusedElement(i)}
                  onSelect={() => {
                    if (option.disabled) return;

                    setInputValue(option.label);
                    getValue({ value: option.value });
                    inputRef.current?.focus();
                    setVisibleOptions(false);
                  }}
                />
              ))}
            </>
          ) : (
            <s.EmptyOptionsContainer key="empty">
              <p>Nenhuma opção encontrada.</p>
            </s.EmptyOptionsContainer>
          )}
        </s.OptionsContainer>
      )}
    </s.RootContainer>
  );
}
