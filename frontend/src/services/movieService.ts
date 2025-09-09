import api from './api';

export interface Movie {
  id: number;
  title: string;
  durationInMinutes: number;
  releaseDate: string;
  description: string
  posterUrl: string | null;
  originalTitle?: string | null
}

interface PaginatedMoviesResponse {
  data: Movie[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface FetchMoviesParams {
  page?: number;
  search?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
}

export const getMyMovies = async (params: FetchMoviesParams): Promise<PaginatedMoviesResponse> => {
  const { data } = await api.get('/movies/my-movies', { params });
  return data;
};

export const getAllMovies = async (params: FetchMoviesParams): Promise<PaginatedMoviesResponse> => {
  const { data } = await api.get('/movies', { params });
  return data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

export const createMovie = async (movieData: FormData): Promise<Movie> => {
  const { data } = await api.post('/movies', movieData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};