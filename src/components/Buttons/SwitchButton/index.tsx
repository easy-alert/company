import ReactSwitch from 'react-switch';
import { ISwitchButton } from './utils/types';
import { theme } from '../../../styles/theme';

export const Switch = ({ disabled, onChange, checked }: ISwitchButton) => (
  <ReactSwitch
    disabled={disabled}
    onChange={onChange}
    checked={checked}
    onColor={theme.color.gray3}
    offColor={theme.color.gray3}
    offHandleColor={theme.color.white}
    onHandleColor={theme.color.gray4}
    handleDiameter={16}
    uncheckedIcon={false}
    checkedIcon={false}
    boxShadow="0px 0px 2px rgba(0, 0, 0, 1)"
    height={12}
    width={28}
  />
);
