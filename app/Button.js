// components/ui/button.js

export const Button = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={`py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
};