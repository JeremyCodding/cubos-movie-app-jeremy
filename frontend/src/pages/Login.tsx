import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthLayout from '../Layouts/AuthLayout';
import { loginUser } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

const schema = yup.object().shape({
  email: yup.string().email('Digite um e-mail válido').required('O e-mail é obrigatório'),
  password: yup.string().required('A senha é obrigatória'),
});

export type LoginFormData = yup.InferType<typeof schema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);
      setToken(response.token);
      toast.success('Login efetuado com sucesso!');
      navigate('/'); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast.error('E-mail ou senha inválidos.');
      } else {
        toast.error('Ocorreu um erro. Por favor, tente novamente.');
      }
      console.error('Falha no login:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-black rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome/E-mail"
            type="email"
            placeholder="Digite seu nome/e-mail"
            register={register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            register={register('password')}
            error={errors.password?.message}
          />
          <div className="flex flex-col items-center justify-between gap-2 mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
            <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
              Esqueci minha senha
            </Link>
            <Link to="/register" className="text-sm text-gray-400 hover:text-gray-300">
              Não tenho conta ainda.
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

