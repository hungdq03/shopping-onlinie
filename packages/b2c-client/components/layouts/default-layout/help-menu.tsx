import Link from 'next/link';
import React from 'react';

type HelpItemProps = {
    href: string;
    title: string;
};

const HelpItem: React.FC<HelpItemProps> = ({ href, title }) => {
    return (
        <div className="py-1">
            <Link className="text-slate-500 hover:text-black" href={href}>
                {title}
            </Link>
        </div>
    );
};

export const HelpMenu = () => {
    return (
        <div className="absolute right-0 top-6 w-[225px] rounded-lg bg-white px-6 py-6 text-[14px] text-black shadow-md">
            <h2 className="text-[16px]">Help</h2>
            <div className="mt-4">
                <HelpItem href="/" title="Order status" />
                <HelpItem href="/" title="Dispatch and Delivery" />
                <HelpItem href="/" title="Returns" />
                <HelpItem href="/" title="Contact Us" />
                <HelpItem href="/" title="Privacy Policy" />
                <HelpItem href="/" title="Terms of Use" />
                <HelpItem href="/" title="Send Us Feedbacks" />
            </div>
        </div>
    );
};
