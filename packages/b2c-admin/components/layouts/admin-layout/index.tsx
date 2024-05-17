import React from 'react';
import Header from '../header';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    return (
        <div>
            <Header title="Admin" />
            {children}
        </div>
    );
};

export default AdminLayout;
