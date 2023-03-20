import "../client/styles/global.css";
import { NetworkInfoContextProvider } from "../client/hooks/useNetworkConnection";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Script
        strategy="worker"
        src="https://www.googletagmanager.com/gtag/js?id=G-FLXKZB06ST"
      />
      <Script id="google-analytics" strategy="worker">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-FLXKZB06ST');
        `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <NetworkInfoContextProvider>
          <SessionProvider>
            <Component {...pageProps} />
          </SessionProvider>
        </NetworkInfoContextProvider>
      </QueryClientProvider>
    </>
  );
}
