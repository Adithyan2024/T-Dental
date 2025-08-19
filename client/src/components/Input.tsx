import React from "react";

interface InputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, type, value, onChange, required }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium" htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded"
    />
  </div>
);

export default Input;
