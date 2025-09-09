import { PrismaClient, Prisma } from '@prisma/client';
import { uploadFileToS3 } from './storage.service.js';

const prisma = new PrismaClient();
const MOVIES_PER_PAGE = 10;

interface MovieFilters {
    search?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
}

const buildWhereClause = (filters: MovieFilters): Prisma.MovieWhereInput => {
    const whereClause: Prisma.MovieWhereInput = {};
    if (filters.search) {
        whereClause.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { originalTitle: { contains: filters.search, mode: 'insensitive' } },
        ];
    }
    if (filters.duration) {
        whereClause.durationInMinutes = { lte: parseInt(filters.duration) };
    }
    if (filters.startDate || filters.endDate) {
        whereClause.releaseDate = {};
        if (filters.startDate) whereClause.releaseDate.gte = new Date(filters.startDate);
        if (filters.endDate) whereClause.releaseDate.lte = new Date(filters.endDate);
    }
    return whereClause;
};

/**
 * Cria um novo filme, associando-o ao usuário logado.
 */
export const createMovie = async (
  movieData: any,
  userId: number, // Recebe o ID do usuário
  file?: Express.Multer.File
) => {
  let posterUrl: string | null = null;
  if (file) {
    posterUrl = await uploadFileToS3(file);
  }

  const duration = parseInt(movieData.durationInMinutes, 10);
  const budget = movieData.budget ? parseFloat(movieData.budget) : null;
  const releaseDate = new Date(movieData.releaseDate);

  if (isNaN(duration)) {
    throw new Error('Duração inválida. Por favor, forneça um número válido.');
  }

  return prisma.movie.create({
    data: {
      title: movieData.title,
      originalTitle: movieData.originalTitle,
      description: movieData.description,
      posterUrl,
      durationInMinutes: duration,
      budget,
      releaseDate,
      userId: userId, // Associa o filme ao usuário que o criou
    },
  });
};

/**
 * Atualiza um filme, mas primeiro verifica se o usuário é o dono.
 */
export const updateMovie = async (
  id: number,
  movieData: any,
  userId: number, // Recebe o ID do usuário para verificação
  file?: Express.Multer.File
) => {
  // Passo 1: Busca o filme no banco de dados.
  const movie = await prisma.movie.findUnique({ where: { id } });

  // Passo 2: Verifica se o filme existe e se o userId corresponde.
  if (!movie) {
    throw new Error(`Filme com ID ${id} não encontrado.`);
  }
  if (movie.userId !== userId) {
    throw new Error('Permission denied: Você não é o dono deste filme.');
  }

  // Passo 3: Se a verificação passar, prossegue com a atualização.
  const updateData: any = { ...movieData };
  if (file) {
    updateData.posterUrl = await uploadFileToS3(file);
  }
  // ... (conversões de tipo como em createMovie) ...

  return prisma.movie.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Deleta um filme, mas primeiro verifica se o usuário é o dono.
 */
export const deleteMovie = async (id: number, userId: number) => {
  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) {
    throw new Error(`Filme com ID ${id} não encontrado.`);
  }
  if (movie.userId !== userId) {
    throw new Error('Permission denied: Você não é o dono deste filme.');
  }

  return prisma.movie.delete({ where: { id } });
};

export const getAllPublicMovies = async (queryParams: MovieFilters) => {
    const page = queryParams.page ? parseInt(queryParams.page) : 1;

    const movies = await prisma.movie.findMany({
        skip: (page - 1) * MOVIES_PER_PAGE,
        take: MOVIES_PER_PAGE,
        orderBy: { releaseDate: 'desc' },
    });
    const totalMovies = await prisma.movie.count();

    return {
        data: movies,
        currentPage: page,
        totalPages: Math.ceil(totalMovies / MOVIES_PER_PAGE),
        totalCount: totalMovies
    };
};

export const getMoviesByUserId = async (queryParams: MovieFilters, userId: number) => {
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const baseWhere = buildWhereClause(queryParams);
    
    // Adiciona a condição de userId à cláusula de filtros
    const where: Prisma.MovieWhereInput = {
        ...baseWhere,
        userId: userId,
    };

    const movies = await prisma.movie.findMany({
        where,
        skip: (page - 1) * MOVIES_PER_PAGE,
        take: MOVIES_PER_PAGE,
        orderBy: { releaseDate: 'desc' },
    });
    const totalMovies = await prisma.movie.count({ where });

    return {
        data: movies,
        currentPage: page,
        totalPages: Math.ceil(totalMovies / MOVIES_PER_PAGE),
        totalCount: totalMovies
    };
};


/**
 * Busca um filme pelo ID, mas apenas se ele pertencer ao usuário logado.
 */
export const getMovieById = async (id: number, userId: number) => {
    const movie = await prisma.movie.findFirst({
        where: { 
            id: id,
            userId: userId // Condição dupla para garantir a posse
        },
    });

    if (!movie) {
        throw new Error(`Filme com ID ${id} não encontrado ou sem permissão.`);
    }
    return movie;
};
