import type { Request, Response } from 'express';
import * as movieService from '../services/movie.service.js';

// Estendemos o tipo Request para que o TypeScript saiba sobre a propriedade 'user'
// que é adicionada pelo nosso middleware de autenticação.
interface AuthRequest extends Request {
  user?: { userId: number };
}

/**
 * Lida com a criação de um novo filme.
 */
export const createMovie = async (req: AuthRequest, res: Response) => {
    try {
        // Extrai o ID do usuário do token JWT (anexado por authMiddleware)
        const userId = req.user!.userId;
        const movie = await movieService.createMovie(req.body, userId, req.file);
        res.status(201).json(movie);
    } catch (error: any) {
        res.status(400).json({ message: 'Falha ao criar o filme', error: error.message });
    }
};

/**
 * Lida com a busca de todos os filmes do usuário logado.
 */
export const getAllPublicMovies = async (req: Request, res: Response) => {
    try {
        const movies = await movieService.getAllPublicMovies(req.query);
        res.status(200).json(movies);
    } catch (error: any) {
        res.status(500).json({ message: 'Falha ao buscar filmes', error: error.message });
    }
};

export const getMyMovies = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const movies = await movieService.getMoviesByUserId(req.query, userId);
        res.status(200).json(movies);
    } catch (error: any) {
        res.status(500).json({ message: 'Falha ao buscar os seus filmes', error: error.message });
    }
};

/**
 * Lida com a busca de um único filme pelo ID.
 */
export const getMovieById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const movieId = parseInt(req.params.id!);
        const movie = await movieService.getMovieById(movieId, userId);
        res.status(200).json(movie);
    } catch (error: any) {
        res.status(404).json({ message: 'Filme não encontrado ou sem permissão', error: error.message });
    }
};


/**
 * Lida com a atualização dos detalhes de um filme.
 */
export const updateMovie = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const movieId = parseInt(req.params.id!);
        const updatedMovie = await movieService.updateMovie(movieId, req.body, userId, req.file);
        res.status(200).json(updatedMovie);
    } catch (error: any) {
        // Se o erro for de permissão, retorna um status 403 (Proibido)
        if (error.message.includes('permission denied')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(404).json({ message: 'Falha ao atualizar o filme', error: error.message });
    }
};

/**
 * Lida com a exclusão de um filme.
 */
export const deleteMovie = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const movieId = parseInt(req.params.id!);
        await movieService.deleteMovie(movieId, userId);
        res.status(204).send(); // Sem Conteúdo
    } catch (error: any) {
        if (error.message.includes('permission denied')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(404).json({ message: 'Falha ao deletar o filme', error: error.message });
    }
};

