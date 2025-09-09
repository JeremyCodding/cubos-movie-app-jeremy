import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const TextArea = ({ label, register, error, ...rest }: TextAreaProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-purple-300 mb-2">
        {label}
      </label>
      <textarea
        {...register}
        {...rest}
        className={`w-full px-4 py-3 bg-[#09090B] border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-32`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
