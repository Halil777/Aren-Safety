import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/config/i18n';
import { GlobalStyles } from '@/shared/styles/global-styles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <StyleProvider hashPriority="high">
            <ThemeProvider>
              <GlobalStyles />
              <AntdApp>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </AntdApp>
            </ThemeProvider>
          </StyleProvider>
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
