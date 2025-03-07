import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconX = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.75 5.25L5.25 18.75"
        stroke="#B21D1D"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18.75 18.75L5.25 5.25"
        stroke="#B21D1D"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconX;
