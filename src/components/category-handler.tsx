'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import qs from 'query-string';

interface Category {
  label: string;
  icon: string;
  description: string;
}

const categories: Category[] = [
  {
    label: 'Beach',
    icon: '🏖️',
    description: 'This property is close to the beach!',
  },
  {
    label: 'Windmills',
    icon: '🌪️',
    description: 'This property has windmills!',
  },
  {
    label: 'Modern',
    icon: '🏙️',
    description: 'This property is modern!',
  },
  {
    label: 'Countryside',
    icon: '🌾',
    description: 'This property is in the countryside!',
  },
  {
    label: 'Pools',
    icon: '🏊‍♂️',
    description: 'This property has a beautiful pool!',
  },
  {
    label: 'Islands',
    icon: '🏝️',
    description: 'This property is on an island!',
  },
  {
    label: 'Lake',
    icon: '🏞️',
    description: 'This property is near a lake!',
  },
  {
    label: 'Skiing',
    icon: '⛷️',
    description: 'This property has skiing activities!',
  },
  {
    label: 'Castles',
    icon: '🏰',
    description: 'This property is an ancient castle!',
  },
  {
    label: 'Caves',
    icon: '🕳️',
    description: 'This property is in a spooky cave!',
  },
  {
    label: 'Camping',
    icon: '⛺',
    description: 'This property offers camping activities!',
  },
  {
    label: 'Arctic',
    icon: '🥶',
    description: 'This property is in the arctic environment!',
  },
  {
    label: 'Desert',
    icon: '🌵',
    description: 'This property is in the desert!',
  },
  {
    label: 'Barns',
    icon: '🏚️',
    description: 'This property is in a barn!',
  },
  {
    label: 'Lux',
    icon: '💎',
    description: 'This property is brand new and luxurious!',
  }
];

export function CategoryHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params?.get('category');

  const handleClick = useCallback((label: string) => {
    let currentQuery: Record<string, any> = {};
    
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    let updatedQuery: Record<string, any> = {
      ...currentQuery,
      category: label,
    };

    if (params?.get('category') === label) {
      // Remove category property by creating a new object without it
      const { category, ...queryWithoutCategory } = updatedQuery;
      updatedQuery = queryWithoutCategory;
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    router.push(url);
  }, [category, router, params]);

  return (
    <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
      {categories.map((item) => (
        <div
          key={item.label}
          onClick={() => handleClick(item.label)}
          className={cn(
            'flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer',
            category === item.label ? 'border-b-neutral-800' : 'border-transparent',
            category === item.label ? 'text-neutral-800' : 'text-neutral-500',
          )}
        >
          <div className="text-2xl">{item.icon}</div>
          <div className="font-medium text-sm">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
