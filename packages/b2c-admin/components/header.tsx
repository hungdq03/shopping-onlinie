import React from 'react';

type Props = {
    title: string;
};

const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className="mb-10 border-b-2 border-b-slate-700 py-5 text-xl font-bold uppercase">
            {title}
        </div>
    );
};

export default Header;
