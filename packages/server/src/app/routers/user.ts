import { Router } from 'express';
import { createUser, getListUser, getUser } from '../controllers/user';
import { isAuthenticated } from '../../middlewares';

export default (router: Router) => {
    router.get('/user', isAuthenticated, getUser);
    router.get('/user/list', getListUser);
    router.post('/user/create', createUser);
};
