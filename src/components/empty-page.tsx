'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EmptyPageProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

export function EmptyPage({
  title = 'No exact matches',
  subtitle = 'Try changing or removing some of your filters.',
  showReset
}: EmptyPageProps) {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <div className="text-2xl font-bold">{title}</div>
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Remove all filters
          </Button>
        )}
      </div>
    </div>
  );
}
