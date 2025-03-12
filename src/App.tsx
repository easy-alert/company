import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer, Slide } from 'react-toastify';

import { ThemeProvider } from 'styled-components';

import { ErrorFallback } from '@components/ErrorFallback';

import { handleError } from '@utils/functions';

import GlobalCSS from '@styles/globalCSS';

import { useCustomTheme } from '@contexts/ThemeContext';

import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/routes';

export default function App() {
  const { currentTheme } = useCustomTheme();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        handleError({ error });
      }}
    >
      <ThemeProvider theme={currentTheme}>
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
