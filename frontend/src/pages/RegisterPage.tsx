import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { registerUser } from '../services/authService';
import AuthLayout from '../Layouts/AuthLayout';

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Digite um e-mail válido').required('O e-mail é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas não correspondem')
    .required('A confirmação da senha é obrigatória'),
});

export type RegisterFormData = yup.InferType<typeof schema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      
      toast.success('Cadastro realizado com sucesso!');
      
      navigate('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error('Este e-mail já está cadastrado. A redirecionar para o login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } 
      else if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
      console.error('Falha no cadastro:', error);
    }
  };

  return (
    <AuthLayout>
        
            <div className="w-full max-w-md p-8 bg-gray-950 rounded-lg"> 
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nome"
                        type="text"
                        placeholder="Digite seu nome"
                        register={register('name')}
                        error={errors.name?.message}
                    />
                    <Input
                        label="E-mail"
                        type="email"
                        placeholder="Digite seu e-mail"
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
                    <Input
                        label="Confirmação de senha"
                        type="password"
                        placeholder="Digite sua senha novamente"
                        register={register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />
                    <div className="flex flex-col items-center justify-between gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                      </Button>
                      <Link to="/login" className="text-sm text-gray-400 hover:text-gray-300">
                        Já tenho conta.
                      </Link>
                    </div>
                </form>
        
        </div>
     
    </AuthLayout>
  );
};

export default RegisterPage;

