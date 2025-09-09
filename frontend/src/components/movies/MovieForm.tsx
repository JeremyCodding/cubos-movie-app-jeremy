import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import { createMovie } from '../../services/movieService';

const schema = yup.object().shape({
  title: yup.string().required('O título é obrigatório'),
  description: yup.string().required('A descrição é obrigatória'),
  durationInMinutes: yup.number().typeError('Deve ser um número').positive('Deve ser positivo').required('A duração é obrigatória'),
  releaseDate: yup.date().typeError('Data inválida').required('A data de lançamento é obrigatória'),
  poster: yup.mixed<FileList>().required("Adicione uma imagem para o poster"),
});

type MovieFormData = yup.InferType<typeof schema>;

interface MovieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieCreated: () => void;
}

const MovieForm = ({ isOpen, onClose, onMovieCreated }: MovieFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<MovieFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: MovieFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('durationInMinutes', String(data.durationInMinutes));
    formData.append('releaseDate', data.releaseDate.toISOString().split('T')[0]);
    
    if (data.poster && data.poster.length > 0) {
      formData.append('poster', data.poster[0]);
    }

    try {
      await createMovie(formData);
      toast.success('Filme adicionado com sucesso!');
      onMovieCreated();
      reset();
      onClose();
    } catch (error) {
      toast.error('Não foi possível adicionar o filme.');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#FFF3] z-40 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#09090B] h-full p-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Adicionar Filme</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Título do Filme" type="text" register={register('title')} error={errors.title?.message} />
          <TextArea label="Descrição" register={register('description')} error={errors.description?.message} />
          <Input label="Duração (minutos)" type="number" register={register('durationInMinutes')} error={errors.durationInMinutes?.message} />
          <Input label="Data de Lançamento" type="date" register={register('releaseDate')} error={errors.releaseDate?.message} />
          <Input label="Pôster do Filme" type="file" register={register('poster')} error={errors.poster?.message as string} />
          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'A Adicionar...' : 'Adicionar Filme'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
