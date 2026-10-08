import express from 'express';
import {login, me, register} from '../controllers/authController.js';
import  {authMiddlware}  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/me', authMiddlware  ,me)
export default router;