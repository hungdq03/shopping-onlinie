import { Router } from 'express';
import {
    createPost,
    deletePost,
    getListPostManage,
    updatePost,
} from '../controllers/post/marketer-post';
import { getPostById, getListPost } from '../controllers/post';

export default (router: Router) => {
    // Auth route
    router.get('/manage/post', getListPostManage);
    router.post('/post/create', createPost);
    router.put('/post/update/:id', updatePost);
    router.delete('/post/delete/:id', deletePost);

    // Public route
    router.get('/post', getListPost);
    router.get('/post/:id', getPostById);
};
