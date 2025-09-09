import { Link } from 'react-router-dom';
import type { Movie } from '../../services/movieService';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const placeholderImage = `https://placehold.co/500x750/09090B/FFFFFF?text=${movie.title.replace(/\s+/g, '+')}`;

  return (
    <Link to={`/movie/${movie.id}`} className="group block overflow-hidden rounded-lg">
      <div className="relative aspect-[2/3] w-full">
        <img
          src={movie.posterUrl || placeholderImage}
          alt={`Pôster do filme ${movie.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 p-4">
            <h3 className="text-lg font-bold text-white">{movie.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;