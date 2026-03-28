export const Button = ({ children, className = "", ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all ${className}`} {...props}>
    {children}
  </button>
);