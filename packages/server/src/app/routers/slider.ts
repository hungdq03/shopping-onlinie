import { Router } from 'express';
import {
    createSlider,
    deleteSliderById,
    getListSliderManage,
    getSliderById,
    updateSlider,
    updateSliderStatus,
} from '../controllers/slider';
import { isAuthenticated, isMarketer } from '../../middlewares';

export default (router: Router) => {
    router.get(
        '/manage/listSlider',
        isAuthenticated,
        isMarketer,
        getListSliderManage
    );

    router.post('/slider/create', isAuthenticated, isMarketer, createSlider);
    router.get(
        '/manage/slider/:id',
        isAuthenticated,
        isMarketer,
        getSliderById
    );
    router.put('/slider/update/:id', isAuthenticated, isMarketer, updateSlider);
    router.delete(
        '/slider/delete/:id',
        isAuthenticated,
        isMarketer,
        deleteSliderById
    );
    router.put(
        '/slider/updateStatus/:id',
        isAuthenticated,
        isMarketer,
        updateSliderStatus
    );
};
