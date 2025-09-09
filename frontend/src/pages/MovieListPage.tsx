import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import FilterModal, { type FilterData } from '../components/movies/FilterModal';
import { getMyMovies, type Movie } from '../services/movieService';
import MovieForm from '../components/movies/MovieForm';
import { PlusCircle } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';
import MainLayout from '../Layouts/MainLayout';

const MovieListPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async (currentFilters: FilterData, currentSearch: string) => {
    try {
      setIsLoading(true);
      const params = {
        ...currentFilters,
        search: currentSearch,
      };
      const response = await getMyMovies(params);
      setMovies(response.data);
    } catch (err) {
      setError('Não foi possível carregar os seus filmes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies(filters, searchTerm);
  }, [filters, searchTerm]); 

  const handleApplyFilters = (data: FilterData) => {
    setFilters(data);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-400 mt-10">A carregar filmes...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (movies.length === 0) {
      return (
        <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">A sua lista de filmes está vazia</h2>
          <p className="mb-6 max-w-md">Parece que você ainda não adicionou nenhum filme. Que tal começar agora e criar a sua coleção pessoal?</p>
          <Button onClick={() => setIsFormOpen(true)} ><PlusCircle size={20} /> Adicionar Filme</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  };

  return (
    <div>
    <MainLayout>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Pesquise por filmes"
            className="bg-gray-800 text-white rounded-lg px-4 py-2 w-full md:w-1/3 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-4">
            <Button onClick={() => setIsFilterOpen(true)} className="bg-gray-700 hover:bg-gray-600">Filtros</Button>
            <Button onClick={() => setIsFormOpen(true)} extraClasses=''>Adicionar Filme</Button>
          </div>
        </div>
        
        {renderContent()}

      </MainLayout>
      <MovieForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onMovieCreated={() => fetchMovies(filters, searchTerm)}
      />
      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
};

export default MovieListPage;

