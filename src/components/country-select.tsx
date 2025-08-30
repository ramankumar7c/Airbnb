'use client';

import { useCountries } from '@/hooks/useCountries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';

interface Country {
  value: string;
  label: string;
  flag: string;
  region: string;
  latlng: [number, number];
}

interface CountrySelectProps {
  value: Country | null;
  onChange: (country: Country | null) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { getAll } = useCountries();
  const [query, setQuery] = useState('');
  const countries = useMemo(() => getAll(), [getAll]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    );
  }, [countries, query]);

  return (
    <div>
      <Select
        value={value?.value}
        onValueChange={(selectedValue) => {
          const country = getAll().find(item => item.value === selectedValue);
          onChange(country || null);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Anywhere" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <div className="p-2 sticky top-0 bg-white">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country..."
            />
          </div>
          {filtered.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <div className="flex items-center gap-2">
                <div>{item.flag}</div>
                <div>{item.label}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
