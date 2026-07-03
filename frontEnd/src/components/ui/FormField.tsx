'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        ref={ref}
        className={cn(
          'rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
);
FormField.displayName = 'FormField';
export default FormField;