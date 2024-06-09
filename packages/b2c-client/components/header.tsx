import { MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useAuth } from '~/hooks/useAuth';
import useLoginModal from '~/hooks/useLoginModal';
import useRegisterModal from '~/hooks/useRegisterModal';

const Header: React.FC = () => {
    const auth = useAuth('client');
    const router = useRouter();
    const { onOpen: openLoginModal } = useLoginModal();
    const { onOpen: openRegisterModal } = useRegisterModal();

    const logOut = () => {
        Cookies.remove('accessTokenClient');
        setTimeout(() => {
            router.reload();
        }, 200);
    };

    const items: MenuProps['items'] = auth
        ? [
              {
                  key: '1',
                  label: <p>Profile</p>,
              },
              {
                  key: '4',
                  label: (
                      <button
                          className="text-rose-500"
                          onClick={logOut}
                          type="button"
                      >
                          Log out
                      </button>
                  ),
              },
          ]
        : [
              {
                  key: '2',
                  label: (
                      <button onClick={openLoginModal} type="button">
                          Login
                      </button>
                  ),
              },
              {
                  key: '3',
                  label: (
                      <button onClick={openRegisterModal} type="button">
                          Register
                      </button>
                  ),
              },
          ];

    return (
        <div className="flex flex-col items-center border-b-2">
            <div className="container flex h-[76px] w-full items-center justify-between px-5">
                <Link href="/">
                    <div className="flex select-none flex-col items-center gap-0 uppercase">
                        <div className="text-lg leading-4 text-rose-600">
                            The
                        </div>
                        <div className="text-2xl font-bold">Perfume</div>
                    </div>
                </Link>
                <div>
                    <Dropdown menu={{ items }} placement="bottomLeft">
                        <div className="flex cursor-pointer space-x-3 rounded-full border px-3 py-1">
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
            </div>
            {/* Sider here */}
        </div>
    );
};

export default Header;
