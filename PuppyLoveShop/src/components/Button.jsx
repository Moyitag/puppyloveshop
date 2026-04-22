import React from 'react';

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
  // variant puede ser 'primary' (rosa fuerte) o 'secondary' (rosa claro)
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";
  
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;