/* eslint-disable @typescript-eslint/no-explicit-any */
import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'common/components/spin';
import { DefaultLayout } from '~/components/layouts/default-layout';

const queryClient = new QueryClient();

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
    P,
    IP
> & {
    getLayout?: (page: ReactElement) => JSX.Element;
    title?: string;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

interface EventListener {
    type: unknown;
    opt?: unknown;
    fn: any;
    shouldRemoveBeforeNavigation?: boolean;
}

declare global {
    interface Window {
        originalAddEventListener: any;
        allHandlers: EventListener[];
        removeEventListeners: (type: string) => void;
        android: any;
        webkit: any;
        AppBridge: any;
        loginFunction: any; // 👈️ turn off type checking
    }
}

if (
    typeof Window !== 'undefined' &&
    Window.prototype.originalAddEventListener == null
) {
    Window.prototype.originalAddEventListener =
        Window.prototype.addEventListener;
    let allHandlers: EventListener[] = [];
    if (typeof window !== 'undefined') window.allHandlers = allHandlers;
    // eslint-disable-next-line func-names
    const addEventListenerHook = function <K extends keyof WindowEventMap>(
        type: K,

        fn: (this: Window, ev: WindowEventMap[K]) => any,
        opt?: boolean | AddEventListenerOptions
    ) {
        allHandlers = allHandlers || [];
        if (['scroll'].includes(type as string)) {
            allHandlers.push({
                type,
                fn,
                opt,
            });
        }
        window.originalAddEventListener(type, fn, opt);
    };

    const removeEventListeners = (type: string) => {
        window?.allHandlers
            ?.filter((e) => e?.type === type && e.shouldRemoveBeforeNavigation)
            ?.forEach((e) => {
                window.removeEventListener('scroll', e.fn);
            });
    };

    Window.prototype.addEventListener = addEventListenerHook;
    Window.prototype.removeEventListeners = removeEventListeners;
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();

    const loadingRef = useRef<unknown | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const start = () => {
            window.removeEventListeners('scroll');
            if (loadingRef.current) {
                clearTimeout(loadingRef.current as number);
            }
            loadingRef.current = setTimeout(() => {
                setLoading(true);
            }, 200);
        };
        const end = () => {
            if (loadingRef.current) {
                clearTimeout(loadingRef.current as number);
            }
            setLoading(false);
        };
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', end);
        router.events.on('routeChangeError', end);
        window.addEventListener('showLoading', start);
        window.addEventListener('hideLoading', end);
        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', end);
            router.events.off('routeChangeError', end);
            window.removeEventListener('showLoading', start);
            window.removeEventListener('hideLoading', end);
        };
    }, []);

    const getLayout =
        Component.getLayout ||
        ((page) => <DefaultLayout>{page}</DefaultLayout>);

    return (
        <QueryClientProvider client={queryClient}>
            <Spin spinning={loading} />
            {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
    );
}
