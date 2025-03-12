import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer, Slide } from 'react-toastify';

import { ThemeProvider } from 'styled-components';

import { ErrorFallback } from '@components/ErrorFallback';

import { handleError } from '@utils/functions';

import { theme } from '@styles/theme';
import GlobalCSS from '@styles/globalCSS';

import AppRoutes from './routes/routes';

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        handleError({ error });
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalCSS />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
        />
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
