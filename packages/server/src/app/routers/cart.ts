import { Router } from 'express';

import { getListCart } from '../controllers/cart';

export default (router: Router) => {
    // Auth route
    router.get('/cart', getListCart);
};
