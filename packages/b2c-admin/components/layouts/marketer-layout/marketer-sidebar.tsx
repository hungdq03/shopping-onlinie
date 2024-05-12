import React from 'react';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'dashboard',
        label: <Link href="/marketer/dashboard">Dashboard</Link>,
    },
    {
        key: 'product',
        label: 'Product',
        children: [
            {
                key: 'productList',
                label: <Link href="/marketer/product">List Product</Link>,
            },
            {
                key: 'brand',
                label: <Link href="/marketer/product/brand">Brand</Link>,
            },
            {
                key: 'category',
                label: <Link href="/marketer/product/category">Category</Link>,
            },
        ],
    },
    {
        key: 'slider',
        label: <Link href="/marketer/slider">Slider</Link>,
    },
    {
        key: 'customer',
        label: <Link href="/marketer/customer">Customer</Link>,
    },
    {
        key: 'feedback',
        label: <Link href="/marketer/feedback">Feedback</Link>,
    },
];

const MarketerSidebar = () => {
    return (
        <Menu
            items={items}
            mode="inline"
            style={{ width: 256, height: 'calc(100vh - 76px)' }}
        />
    );
};

export default MarketerSidebar;
