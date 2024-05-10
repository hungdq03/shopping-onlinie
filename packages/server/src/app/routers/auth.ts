import { Router } from 'express';
import { loginUser, refreshToken, signup } from '../controllers/auth';

export default (router: Router) => {
    router.post('/auth/register', signup);
    router.post('/auth/login', loginUser);
    router.post('/auth/refreshToken', refreshToken);
};
