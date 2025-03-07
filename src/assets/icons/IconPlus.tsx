import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconPlus = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 8H13.5"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />

      <path
        d="M8 2.5V13.5"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconPlus;
