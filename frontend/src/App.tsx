import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import MovieListPage from './pages/MovieListPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ResetPasswordPage from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MovieListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id" 
          element={
            <ProtectedRoute>
              <MovieDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;