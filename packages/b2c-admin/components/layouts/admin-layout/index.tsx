import React from 'react';
import Header from '../header';
import AdminSidebar from './admin-sidebar';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    return (
        <div>
            <Header title="Admin" />
            <main className="flex h-full">
                <AdminSidebar />
                <section className="max-h-[calc(100vh_-_76px)] flex-1 overflow-auto p-4">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;
