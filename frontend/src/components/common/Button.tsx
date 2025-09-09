interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  extraClasses?: string
}

const Button = ({ children, extraClasses,  ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`w-full bg-[#5900A7] hover:bg-[#4d008f] text-white font-bold py-3 px-4 rounded-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 hover:cursor-pointer min-w-[200px] ${extraClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;