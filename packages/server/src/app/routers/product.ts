import { Router } from 'express';

import {
    createProduct,
    getListProductManage,
} from '../controllers/product/cms-product';

export default (router: Router) => {
    // Auth route
    router.get('/manage/product', getListProductManage);
    router.post('/product/create', createProduct);
    // router.put('/brand/update/:id', updateBrand);
    // router.delete('/brand/delete/:id', deleteBrand);

    // Public route
    // router.get('/brand', getListBrand);
    // router.get('/brand/:id', getBrandById);
};
