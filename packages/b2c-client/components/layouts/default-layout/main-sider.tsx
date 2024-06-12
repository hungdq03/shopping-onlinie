import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { cn } from 'common/utils';
import { convertObjectToQuery } from 'common/utils/convertObjectToQuery';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { QueryResponseType } from 'common/types';
import { Category } from 'common/types/product';

type SiderItemProps = {
    title: string;
    href: string;
    query?: Record<string, string | number | boolean>;
};

const SiderItem: React.FC<SiderItemProps> = ({ title, href, query }) => {
    const router = useRouter();

    const isActiveLink = useMemo(() => {
        if (!query && router.asPath === href) {
            return true;
        }
        if (
            query &&
            router.asPath === `${href}?${convertObjectToQuery(query ?? {})}`
        ) {
            return true;
        }
        return false;
    }, [router.asPath, href, query]);

    return (
        <Link
            className={cn(
                'font-semibold uppercase',
                isActiveLink && 'text-primary font-bold'
            )}
            href={{ pathname: href, query }}
        >
            {title}
        </Link>
    );
};

const MainSider = () => {
    const { data } = useQuery<QueryResponseType<Category>>({
        queryKey: ['category-list'],
        queryFn: () => request.get('category').then((res) => res.data),
    });
    return (
        <div>
            <div className="container py-3">
                <div className="space-x-4">
                    <SiderItem href="/" title="Trang chủ" />
                    <SiderItem href="/product" title="Tất cả sản phẩm" />
                    {data?.data?.map((item) => (
                        <SiderItem
                            href="/product"
                            query={{ category: item.id ?? '' }}
                            title={item.name ?? ''}
                        />
                    ))}
                    <SiderItem href="/blog" title="Blog" />
                </div>
            </div>
        </div>
    );
};

SiderItem.defaultProps = {
    query: undefined,
};

export default MainSider;
