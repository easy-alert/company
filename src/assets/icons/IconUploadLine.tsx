import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconUploadLine = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.0625 7.6875L12 3.75L15.9375 7.6875"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
      <path
        d="M12 14.25V3.75"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
      <path
        d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
        stroke="#B21D1D"
        stroke-Width="1.5"
        stroke-Linecap="round"
        stroke-Linejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconUploadLine;
