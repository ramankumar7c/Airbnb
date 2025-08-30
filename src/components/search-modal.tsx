'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatISO } from 'date-fns';
import qs from 'query-string';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CountrySelect } from './country-select';
import { CounterInput } from './counter-input';
import { Calendar } from '@/components/ui/calendar';

interface Country {
  value: string;
  label: string;
  flag: string;
  region: string;
  latlng: [number, number];
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = {
  LOCATION: 0,
  DATE: 1,
  INFO: 2,
} as const;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(STEPS.LOCATION);
  
  const [location, setLocation] = useState<Country | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery: Record<string, any> = {};

    if (searchParams) {
      currentQuery = qs.parse(searchParams.toString());
    }

    const updatedQuery: Record<string, any> = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.from) {
      updatedQuery.startDate = formatISO(dateRange.from);
    }

    if (dateRange.to) {
      updatedQuery.endDate = formatISO(dateRange.to);
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    onClose();

    router.push(url);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div className="text-start">
        <div className="text-2xl font-bold">Where do you wanna go?</div>
        <div className="text-neutral-500 mt-2">Find the perfect location!</div>
      </div>
      <CountrySelect 
        value={location} 
        onChange={(value) => setLocation(value)} 
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="text-start">
          <div className="text-2xl font-bold">When do you plan to go?</div>
          <div className="text-neutral-500 mt-2">Make sure everyone is free!</div>
        </div>
        <Calendar
          mode="range"
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => 
            setDateRange({
              from: range?.from,
              to: range?.to,
            })
          }
          className="rounded-md border"
          disabled={{ before: new Date() }}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="text-start">
          <div className="text-2xl font-bold">More information</div>
          <div className="text-neutral-500 mt-2">Find your perfect place!</div>
        </div>
        <CounterInput
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <hr />
        <CounterInput
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you need?"
        />
        <hr />
        <CounterInput
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
        />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {bodyContent}
        </div>
        <div className="flex flex-col gap-2 p-6">
          <div className="flex flex-row items-center gap-4 w-full">
            {secondaryActionLabel && (
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                {secondaryActionLabel}
              </Button>
            )}
            <Button
              onClick={onSubmit}
              className="w-full bg-rose-500 hover:bg-rose-600"
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
