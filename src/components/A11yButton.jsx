import React from 'react';

// Reusable accessible button. Use native <button> to preserve semantics.
// Accepts the same props as a normal button and merges classes.
export default function A11yButton({ children, className = '', ...props }) {
  return (
    <button
      className={['a11y-button', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
