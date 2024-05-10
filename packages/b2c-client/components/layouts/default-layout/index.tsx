import React from 'react';
import { Navbar } from './navbar';

type Props = {
    children: React.ReactNode;
};

export const DefaultLayout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};
