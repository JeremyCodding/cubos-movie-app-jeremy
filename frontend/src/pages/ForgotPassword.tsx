import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthLayout from '../Layouts/AuthLayout';
import { forgotPassword } from '../services/authService';

const schema = yup.object().shape({
  email: yup.string().email('Digite um e-mail válido').required('O e-mail é obrigatório'),
});

type ForgotPasswordFormData = yup.InferType<typeof schema>;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      toast.success('Se este e-mail estiver cadastrado, um link de recuperação foi enviado.', {
        duration: 5000,
      });
      navigate('/login'); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.success('Se este e-mail estiver cadastrado, um link de recuperação foi enviado.', {
        duration: 5000,
      });
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-black rounded-lg">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recuperar Senha</h2>
            <p className="text-gray-400 mt-2">Digite o seu e-mail para receber um link de recuperação.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            register={register('email')}
            error={errors.email?.message}
          />
          <div className="flex flex-col items-center justify-between gap-3 mt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'A Enviar...' : 'Enviar Link'}
            </Button>
            <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300">
              Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
