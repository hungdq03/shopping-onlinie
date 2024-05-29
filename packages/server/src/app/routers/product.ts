import { Router } from 'express';

import { isAuthenticated, isMarketer } from '../../middlewares';
import {
    createProduct,
    getListProductManage,
    getProductById,
    updateProduct,
} from '../controllers/product/cms-product';
import { getListProductSelect } from '../controllers/product';

export default (router: Router) => {
    // Auth route
    router.get(
        '/manage/product',
        isAuthenticated,
        isMarketer,
        getListProductManage
    );
    router.post('/product/create', createProduct);
    router.get('/manage/product/:id', getProductById);
    router.put('/product/update/:id', updateProduct);
    // router.delete('/brand/delete/:id', deleteBrand);

    // Public route
    router.get('/product/select', getListProductSelect);
};
