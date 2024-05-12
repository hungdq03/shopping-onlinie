import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { MenuOutlined } from '@ant-design/icons';

type Props = {
    title: string;
};

const Header: React.FC<Props> = ({ title }) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <p>Profile</p>,
        },
        {
            key: '2',
            label: <p className="text-rose-500">Logout</p>,
        },
    ];

    return (
        <header className="flex h-[76px] w-full items-center justify-between px-5 shadow-lg">
            <h3 className="text-2xl font-bold uppercase">{title}</h3>
            <div>
                <Dropdown menu={{ items }} placement="bottomLeft">
                    <div className="flex cursor-pointer space-x-3 rounded-full border px-4 py-2">
                        <Image
                            alt="avatar"
                            className="rounded-full"
                            height={40}
                            src="/images/placeholder.jpg"
                            width={40}
                        />
                        <MenuOutlined />
                    </div>
                </Dropdown>
            </div>
        </header>
    );
};

export default Header;
