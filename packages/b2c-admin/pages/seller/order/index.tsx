import React from 'react';
import Header from '~/components/header';
import OrderList from '~/components/seller/order';

const OrderPage = () => {
    return (
        <div>
            <Header title="Order List" />
            <OrderList />
        </div>
    );
};

export default OrderPage;
