import { Link } from 'react-router-dom';
import logoUrl from '../../assets/logo-cubos-movie.svg';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
      <img 
        src={logoUrl} 
        alt="Logótipo da Cubos Movies" 
        className="h-8 w-auto"
      />
        <span className="font-light">Movies</span>
    </Link>
  );
};

export default Logo;

