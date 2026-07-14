'use client';

import * as React from 'react';

export type ToggleGroupOption<T extends string = string> = {
  value: T;
  label: string;
};

interface ToggleGroupProps<T extends string> {
  options: ToggleGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              active
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}