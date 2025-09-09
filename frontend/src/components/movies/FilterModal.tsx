import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export interface FilterData {
  duration?: number;
  startDate?: string;
  endDate?: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (data: FilterData) => void;
  initialFilters: FilterData;
}

const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }: FilterModalProps) => {
  const { register, handleSubmit, reset } = useForm<FilterData>({
    defaultValues: initialFilters,
  });

  const onSubmit = (data: FilterData) => {
    onApplyFilters(data);
    onClose();
  };
  
  const handleClear = () => {
    reset({ duration: undefined, startDate: '', endDate: '' });
    onApplyFilters({});
    onClose();
  }
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#FFF3] z-40 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#09090B] rounded-lg p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Filtros</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Duração Máxima (minutos)" type="number" register={register('duration')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data de Lançamento (Início)" type="date" register={register('startDate')} />
            <Input label="Data de Lançamento (Fim)" type="date" register={register('endDate')} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={handleClear} className="bg-gray-700 hover:bg-gray-600">
              Limpar Filtros
            </Button>
            <Button type="submit">
              Aplicar Filtros
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
