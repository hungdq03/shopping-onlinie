/* eslint-disable @typescript-eslint/no-explicit-any */
import '~/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import DefaultLayout from '~/components/layouts/default-layout';
import AdminLayout from '~/components/layouts/admin-layout';
import SellerLayout from '~/components/layouts/seller-layout';
import MarketerLayout from '~/components/layouts/marketer-layout';

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

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const role: string = 'MARKETER';

    const router = useRouter();

    const loadingRef = useRef<unknown | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const start = () => {
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

    let getLayout =
        Component.getLayout ||
        ((page) => <DefaultLayout>{page}</DefaultLayout>);

    if (role === 'ADMIN') {
        getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
    }

    if (role === 'SELLER') {
        getLayout = (page) => <SellerLayout>{page}</SellerLayout>;
    }

    if (role === 'MARKETER') {
        getLayout = (page) => <MarketerLayout>{page}</MarketerLayout>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Spin fullscreen spinning={loading} />
            <ToastContainer />
            {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
    );
}
