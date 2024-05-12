import React from 'react';
import Header from '../header';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    return (
        <main>
            <Header title="Admin" />
            {children}
        </main>
    );
};

export default AdminLayout;
