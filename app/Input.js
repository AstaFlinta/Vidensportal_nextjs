// components/ui/input.js

export const Input = ({ ...props }) => {
  return (
    <input
      className="border rounded p-2"
      {...props}
    />
  );
};