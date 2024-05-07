import Image from 'next/image';
import React from 'react';

export const Navbar = () => {
    return (
        <nav>
            <div className="flex h-9 items-center justify-between bg-neutral-100 px-11">
                <Image
                    alt="jordan"
                    height={24}
                    src="/icons/jordan-2.svg"
                    width={24}
                />
                <div className="flex gap-1 text-xs font-semibold">
                    <div className="relative">
                        <div
                            className="cursor-pointer px-2 hover:text-slate-400"
                            role="presentation"
                        >
                            <span>Help</span>
                        </div>
                    </div>
                    <p>|</p>
                    <p className="cursor-pointer px-2 hover:text-slate-400">
                        Sign In
                    </p>
                </div>
            </div>
        </nav>
    );
};
