import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconSearch = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.25 12.5C10.1495 12.5 12.5 10.1495 12.5 7.25C12.5 4.35051 10.1495 2 7.25 2C4.35051 2 2 4.35051 2 7.25C2 10.1495 4.35051 12.5 7.25 12.5Z"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
      <path
        d="M10.9624 10.9629L13.9999 14.0004"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconSearch;
