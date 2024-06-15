import { Router } from 'express';

import {
    addToCart,
    deleteCartProduct,
    getListCart,
    updateQuantity,
} from '../controllers/cart';

import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    // Auth route
    router.get('/cart', getListCart);
    router.delete('/cart/delete/:id', deleteCartProduct);
    router.post('/cart/add', isAuthenticated, addToCart);
    router.put('/cart/updateQuantity/:id', updateQuantity);
};
