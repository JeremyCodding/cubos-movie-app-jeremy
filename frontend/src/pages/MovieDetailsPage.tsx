import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, type Movie } from '../services/movieService';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';

const MovieDetailsPage = () => {
  // O hook useParams extrai os parâmetros da URL, como o :id
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Garantimos que o ID é um número válido antes de buscar
    const movieId = Number(id);
    if (isNaN(movieId)) {
      setError('ID de filme inválido.');
      setIsLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const movieData = await getMovieById(movieId);
        setMovie(movieData);
      } catch (err) {
        setError('Não foi possível carregar os detalhes do filme.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const renderContent = () => {
    if (isLoading) return <p className="text-center text-gray-400">A carregar detalhes...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!movie) return <p className="text-center text-gray-400">Filme não encontrado.</p>;
    
    const placeholderImage = `https://placehold.co/500x750/09090B/FFFFFF?text=${movie.title.replace(/\s+/g, '+')}`;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img 
            src={movie.posterUrl || placeholderImage}
            alt={`Pôster de ${movie.title}`}
            className="rounded-lg w-full"
          />
        </div>
        <div className="md:col-span-2 text-white">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.originalTitle && <h2 className="text-xl text-gray-400 mb-6">{movie.originalTitle}</h2>}
          <p className="text-gray-300 mb-6 break-words">{movie.description}</p>
          
          <div className="space-y-2">
            <p><strong>Duração:</strong> {movie.durationInMinutes} minutos</p>
            <p><strong>Lançamento:</strong> {new Date(movie.releaseDate).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft size={20} />
          Voltar
        </button>
        {renderContent()}
      </MainLayout>
  );
};

export default MovieDetailsPage;
