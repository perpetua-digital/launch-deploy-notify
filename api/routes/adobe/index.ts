import { Router } from 'express';
import okRouter from './ok'
import libraryCheckRouter from './libraryCheck'

const router = Router();

// 200 everything is ok
router.use('/ok', okRouter);

router.use('/librarycheck', libraryCheckRouter)

export default router;
