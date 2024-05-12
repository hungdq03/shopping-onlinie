import React from 'react';

type Props = {
    children: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
    return (
        <main>
            <header>Default</header>
            {children}
        </main>
    );
};

export default DefaultLayout;
