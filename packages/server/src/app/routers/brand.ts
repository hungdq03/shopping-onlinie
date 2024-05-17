import { Router } from 'express';
import {
    createBrand,
    deleteBrand,
    getListBrandManage,
    updateBrand,
} from '../controllers/brand/marketer-brand';
import { getBrandById, getListBrand } from '../controllers/brand';

export default (router: Router) => {
    // Auth route
    router.get('/manage/brand', getListBrandManage);
    router.post('/brand/create', createBrand);
    router.post('/brand/update/:id', updateBrand);
    router.delete('/brand/delete/:id', deleteBrand);

    // Public route
    router.get('/brand', getListBrand);
    router.get('/brand/:id', getBrandById);
};
