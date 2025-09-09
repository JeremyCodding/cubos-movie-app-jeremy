import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { useAuthStore } from '../../stores/authStore';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="top-0 left-0 w-full p-6 z-20 bg-black">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center justify-around gap-4">
          <ThemeToggle />
          {isAuthenticated && (
            <Button
              onClick={logout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
