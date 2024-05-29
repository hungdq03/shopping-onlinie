import { Router } from 'express';
import {
    changePassword,
    checkVerify,
    loginClient,
    refreshToken,
    register,
    senMailResetPassword,
    verifyEmail,
} from '../controllers/auth';
import { loginAdmin } from '../controllers/auth/admin';

export default (router: Router) => {
    // admin
    router.post('/auth/admin/login', loginAdmin);
    // user
    router.post('/auth/user/register', register);
    router.post('/auth/verify-email/:email', verifyEmail);
    router.post('/auth/check-verify', checkVerify);
    router.post('/auth/user/login', loginClient);
    router.post('/auth/refreshToken', refreshToken);
    router.post('/auth/reset-password/:email', senMailResetPassword);
    router.post('/auth/change-password', changePassword);
};
