import React from 'react';

const Input = ({ type, placeholder, name, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="input-pink"
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        width: '100%',
        marginBottom: '15px',
        outline: 'none'
      }}
    />
  );
};

export default Input;