'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface CounterInputProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

export function CounterInput({
  title,
  subtitle,
  value,
  onChange,
}: CounterInputProps) {
  const onAdd = () => {
    onChange(value + 1);
  };

  const onReduce = () => {
    if (value === 1) {
      return;
    }
    onChange(value - 1);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onReduce}
          disabled={value === 1}
          className="w-10 h-10 rounded-full p-0"
        >
          <Minus size={16} />
        </Button>
        <div className="font-light text-xl text-neutral-600">{value}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="w-10 h-10 rounded-full p-0"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}
