import { Router } from 'express';
import userRoutes from './user.routes.js';
import movieRoutes from './movie.routes.js'

const router = Router();

router.use('/users', userRoutes);
router.use('/movies', movieRoutes)

export default router;