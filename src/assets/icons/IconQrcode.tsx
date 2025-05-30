import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconQrcode = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 3H3.5C3.22386 3 3 3.22386 3 3.5V6.5C3 6.77614 3.22386 7 3.5 7H6.5C6.77614 7 7 6.77614 7 6.5V3.5C7 3.22386 6.77614 3 6.5 3Z"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9H3.5C3.22386 9 3 9.22386 3 9.5V12.5C3 12.7761 3.22386 13 3.5 13H6.5C6.77614 13 7 12.7761 7 12.5V9.5C7 9.22386 6.77614 9 6.5 9Z"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 3H9.5C9.22386 3 9 3.22386 9 3.5V6.5C9 6.77614 9.22386 7 9.5 7H12.5C12.7761 7 13 6.77614 13 6.5V3.5C13 3.22386 12.7761 3 12.5 3Z"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V11"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13H11V9"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 10H13"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 12V13"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconQrcode;
