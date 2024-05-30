import { Router } from 'express';
import { isAuthenticated, isMarketer } from '../../middlewares';
import { getListSliderSelect, getSliderById } from '../controllers/slider';
import {
    createSlider,
    deleteSlider,
    getListSliderManage,
    updateSlider,
} from '../controllers/slider/marketer-slider';

export default (router: Router) => {
    // Auth route
    router.get(
        '/manage/slider',
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
    ); // Fixed this line
    router.put('/slider/update/:id', isAuthenticated, isMarketer, updateSlider);
    router.delete(
        '/slider/delete/:id',
        isAuthenticated,
        isMarketer,
        deleteSlider
    );

    // Public route
    router.get('/slider/select', getListSliderSelect);
};
