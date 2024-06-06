import { Router } from 'express';

import { isAuthenticated, isMarketer } from '../../middlewares';
import {
    createProduct,
    deleteProductById,
    getListProductManage,
    getPaginatedProducts,
    getProductById,
    updateProduct,
    updateProductStatus,
} from '../controllers/product/cms-product';
import { getListProductSelect } from '../controllers/product';

export default (router: Router) => {
    // Auth route
    router.get(
        '/manage/product',
        // isAuthenticated,
        // isMarketer,
        getListProductManage
    );
    router.post('/product/create', isAuthenticated, isMarketer, createProduct);
    router.get(
        '/manage/product/:id',
        isAuthenticated,
        isMarketer,
        getProductById
    );
    router.put(
        '/product/update/:id',
        isAuthenticated,
        isMarketer,
        updateProduct
    );
    router.delete(
        '/product/delete/:id',
        isAuthenticated,
        isMarketer,
        deleteProductById
    );
    router.put(
        '/product/updateStatus/:id',
        isAuthenticated,
        isMarketer,
        updateProductStatus
    );

    // Public route
    router.get('/product/select', getListProductSelect);
    router.get('/products', getPaginatedProducts);
};
