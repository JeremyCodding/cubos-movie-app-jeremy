import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const Input = ({ label, register, error, ...rest }: InputProps) => {
  return (
    <div className="w-full my-2">
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <input
        {...register}
        {...rest}
        className={`w-full px-4 py-3 bg-[#09090B] border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;

