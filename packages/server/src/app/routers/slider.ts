import { Router } from 'express';
import { getListSlider, getSliderById } from '../controllers/slider';
import {
    createSlider,
    deleteSlider,
    getListSliderManage,
    updateSlider,
} from '../controllers/slider/marketer-slider';

export default (router: Router) => {
    router.post('/slider/create', createSlider);
    router.get('/slider', getListSlider);
    router.get('/slider/:id', getSliderById);
    router.get('/manage/slider', getListSliderManage);
    router.put('/slider/update/:id', updateSlider);
    router.delete('/slider/delete/:id', deleteSlider);
};
