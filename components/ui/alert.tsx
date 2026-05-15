import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Alert({ className = '', ...props }: AlertProps) {
  return <div className={`rounded-lg border p-4 ${className}`} {...props} />;
}

export function AlertDescription({ className = '', ...props }: AlertProps) {
  return <div className={`text-sm ${className}`} {...props} />;
}

export function AlertTitle({ className = '', ...props }: AlertProps) {
  return <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />;
}
