import { Router } from 'express';
import { getListUser, getUser } from '../controllers/user';
import { isAuthenticated } from '../../middlewares';

export default (router: Router) => {
    router.get('/user', isAuthenticated, getUser);
    router.get('/listUser', getListUser);
};
