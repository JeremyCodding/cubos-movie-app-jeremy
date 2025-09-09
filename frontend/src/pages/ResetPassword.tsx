import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthLayout from '../Layouts/AuthLayout';
import { resetPassword } from '../services/authService';

// Esquema de validação para a nova senha
const schema = yup.object().shape({
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A nova senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas não correspondem')
    .required('A confirmação da senha é obrigatória'),
});

type ResetPasswordFormData = yup.InferType<typeof schema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  // Efeito para pegar o token da URL quando a página carrega
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      toast.error('Token de recuperação inválido ou ausente.');
      navigate('/login');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return; // Segurança extra

    try {
      await resetPassword(token, data.password);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Não foi possível redefinir a senha. O token pode ser inválido ou ter expirado.');
    }
  };

  if (!token) {
    // Mostra uma mensagem de carregamento ou nada enquanto verifica o token
    return null; 
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-black rounded-lg">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Redefinir Senha</h2>
            <p className="text-gray-400 mt-2">Digite a sua nova senha abaixo.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nova Senha"
            type="password"
            register={register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Confirmar Nova Senha"
            type="password"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <div className="mt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'A Redefinir...' : 'Redefinir Senha'}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
