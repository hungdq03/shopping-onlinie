import { Router } from 'express';
import { getUser } from '../controllers/user';
import { isAuthenticated } from '../../middlewares';

export default (router: Router) => {
    router.get('/user', isAuthenticated, getUser);
};
