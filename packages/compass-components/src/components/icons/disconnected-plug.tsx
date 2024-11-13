import { palette } from '@leafygreen-ui/palette';
import React, { useMemo } from 'react';

import { useDarkMode } from '../../hooks/use-theme';

const DisconnectedPlugIcon: React.FunctionComponent = () => {
  const darkMode = useDarkMode();

  const fillColor = useMemo(
    () => (darkMode ? palette.white : palette.black),
    [darkMode]
  );

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.0306 3.96938C13.961 3.89946 13.8782 3.84398 13.787 3.80613C13.6958 3.76827 13.5981 3.74879 13.4994 3.74879C13.4007 3.74879 13.3029 3.76827 13.2118 3.80613C13.1206 3.84398 13.0378 3.89946 12.9681 3.96938L11 5.9375L9.0625 4L11.0325 2.03063C11.1734 1.88973 11.2526 1.69864 11.2526 1.49938C11.2526 1.30012 11.1734 1.10902 11.0325 0.968128C10.8916 0.827232 10.7005 0.748077 10.5013 0.748077C10.302 0.748077 10.1109 0.827232 9.97001 0.968128L8 2.9375L6.53063 1.46938C6.46086 1.39961 6.37804 1.34427 6.28689 1.30652C6.19574 1.26876 6.09804 1.24933 5.99938 1.24933C5.80012 1.24933 5.60903 1.32848 5.46813 1.46938C5.32723 1.61027 5.24808 1.80137 5.24808 2.00063C5.24808 2.19989 5.32723 2.39098 5.46813 2.53188L5.6875 2.75L2.55563 5.88375C2.30023 6.13912 2.09763 6.4423 1.9594 6.77597C1.82117 7.10964 1.75003 7.46727 1.75003 7.82844C1.75003 8.18961 1.82117 8.54724 1.9594 8.88091C2.09763 9.21459 2.30023 9.51776 2.55563 9.77313L3.36063 10.5781L0.46938 13.4694C0.399615 13.5391 0.344274 13.622 0.306518 13.7131C0.268762 13.8043 0.249329 13.902 0.249329 14.0006C0.249329 14.0993 0.268762 14.197 0.306518 14.2881C0.344274 14.3793 0.399615 14.4621 0.46938 14.5319C0.610276 14.6728 0.801372 14.7519 1.00063 14.7519C1.09929 14.7519 1.19699 14.7325 1.28814 14.6947C1.37929 14.657 1.46211 14.6016 1.53188 14.5319L4.42313 11.6406L5.22813 12.4456C5.4835 12.701 5.78667 12.9036 6.12034 13.0419C6.45402 13.1801 6.81165 13.2512 7.17282 13.2512C7.53399 13.2512 7.89162 13.1801 8.22529 13.0419C8.55896 12.9036 8.86214 12.701 9.11751 12.4456L12.25 9.3125L12.4694 9.5325C12.5391 9.60227 12.622 9.65761 12.7131 9.69536C12.8043 9.73312 12.902 9.75255 13.0006 9.75255C13.0993 9.75255 13.197 9.73312 13.2881 9.69536C13.3793 9.65761 13.4621 9.60227 13.5319 9.5325C13.6016 9.46274 13.657 9.37992 13.6947 9.28876C13.7325 9.19761 13.7519 9.09992 13.7519 9.00125C13.7519 8.90259 13.7325 8.80489 13.6947 8.71374C13.657 8.62259 13.6016 8.53977 13.5319 8.47L12.0625 7L14.0325 5.03063C14.1021 4.96085 14.1573 4.87804 14.1949 4.78692C14.2325 4.69581 14.2517 4.59818 14.2515 4.49961C14.2514 4.40105 14.2318 4.30349 14.1939 4.21251C14.156 4.12153 14.1005 4.03891 14.0306 3.96938ZM8.05563 11.3838C7.93955 11.4999 7.80173 11.592 7.65004 11.6549C7.49835 11.7177 7.33576 11.75 7.17157 11.75C7.00737 11.75 6.84479 11.7177 6.6931 11.6549C6.54141 11.592 6.40358 11.4999 6.2875 11.3838L3.61625 8.7125C3.50013 8.59642 3.40801 8.4586 3.34516 8.30691C3.28231 8.15522 3.24996 7.99264 3.24996 7.82844C3.24996 7.66425 3.28231 7.50166 3.34516 7.34997C3.40801 7.19828 3.50013 7.06046 3.61625 6.94438L6.75 3.8125L11.1875 8.25L8.05563 11.3838Z" />
    </svg>
  );
};

export { DisconnectedPlugIcon };