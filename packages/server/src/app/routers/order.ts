import { Router } from 'express';

import { isAuthenticated } from '../../middlewares';
import { getListOrder, getOrderDetail } from '../controllers/order';

export default (router: Router) => {
    router.get('/my-order', isAuthenticated, getListOrder);
    router.get('/order-detail/:id', isAuthenticated, getOrderDetail);
};
