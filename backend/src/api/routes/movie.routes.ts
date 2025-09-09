import { Router } from 'express';
import multer from 'multer';
import * as movieController from '../controllers/movie.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authMiddleware);

/**
 * Example: GET /api/movies?page=1&search=Inception&duration=120
 */
router.get('/', movieController.getAllPublicMovies);
router.get('/my-movies', movieController.getMyMovies);
router.post('/', upload.single('poster'), movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.patch('/:id',upload.single('poster'), movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);


export default router;
