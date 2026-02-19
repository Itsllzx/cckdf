'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type Props<T extends z.ZodTypeAny> = {
  schema: T;
  fields: Array<{ name: keyof z.infer<T> & string; label: string; type: string }>;
  submitLabel: string;
  onSubmit: (data: z.infer<T>) => Promise<void>;
};

export function AuthForm<T extends z.ZodTypeAny>({ schema, fields, submitLabel, onSubmit }: Props<T>) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<z.infer<T>>({ resolver: zodResolver(schema) });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (data) => {
        setError('');
        try {
          await onSubmit(data);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Request failed');
        }
      })}
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="text-sm text-white/80">
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            {...register(field.name)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2 outline-none focus:border-accent"
            aria-label={field.label}
          />
          {errors[field.name] && <p className="text-sm text-red-300">{String(errors[field.name]?.message)}</p>}
        </div>
      ))}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] py-2 font-medium">
        {isSubmitting ? 'Loading...' : submitLabel}
      </button>
    </form>
  );
}
