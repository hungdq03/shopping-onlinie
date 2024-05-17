import { Router } from 'express';
import { loginUser, refreshToken } from '../controllers/auth/user';
import { loginAdmin, register } from '../controllers/auth/admin';

export default (router: Router) => {
    // admin
    router.post('/auth/admin/login', loginAdmin);
    // user
    router.post('/auth/user/register', register);
    router.post('/auth/user/login', loginUser);
    router.post('/auth/refreshToken', refreshToken);
};
