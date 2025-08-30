'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountrySelect } from '@/components/country-select';
import { CounterInput } from '@/components/counter-input';
import { ImageUpload } from '@/components/image-upload';
import { toast } from 'sonner';

interface Category {
  label: string;
  icon: string;
}

interface Location {
  value: string;
  label: string;
  flag: string;
  region: string;
  latlng: [number, number];
}

interface FormData {
  category: string;
  location: Location | null;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: string;
  price: string;
  title: string;
  description: string;
}

const categories: Category[] = [
  { label: 'Beach', icon: '🏖️' },
  { label: 'Windmills', icon: '🌪️' },
  { label: 'Modern', icon: '🏙️' },
  { label: 'Countryside', icon: '🌾' },
  { label: 'Pools', icon: '🏊‍♂️' },
  { label: 'Islands', icon: '🏝️' },
  { label: 'Lake', icon: '🏞️' },
  { label: 'Skiing', icon: '⛷️' },
  { label: 'Castles', icon: '🏰' },
  { label: 'Desert', icon: '🌵' },
  { label: 'Lux', icon: '💎' },
];

export default function BecomeAHost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    category: '',
    location: null,
    guestCount: 1,
    roomCount: 1,
    bathroomCount: 1,
    imageSrc: '',
    price: '',
    title: '',
    description: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }

    if (!formData.category || !formData.location || !formData.imageSrc || !formData.price || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      toast.success('Listing created successfully!');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
              <p className="text-gray-600 mb-4">You need to be signed in to create a listing.</p>
              <Button onClick={() => router.push('/sign-in')} className="w-full">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Become a Host</h1>
        <p className="text-gray-600 mt-2">Create your listing in just a few steps</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category.label}
                  onClick={() => setFormData({ ...formData, category: category.label })}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.category === category.label
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium">{category.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <CountrySelect
              value={formData.location}
              onChange={(location) => setFormData({ ...formData, location })}
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CounterInput
              title="Guests"
              subtitle="How many guests can stay?"
              value={formData.guestCount}
              onChange={(guestCount) => setFormData({ ...formData, guestCount })}
            />
            <hr />
            <CounterInput
              title="Rooms"
              subtitle="How many rooms are available?"
              value={formData.roomCount}
              onChange={(roomCount) => setFormData({ ...formData, roomCount })}
            />
            <hr />
            <CounterInput
              title="Bathrooms"
              subtitle="How many bathrooms are there?"
              value={formData.bathroomCount}
              onChange={(bathroomCount) => setFormData({ ...formData, bathroomCount })}
            />
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Property Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={formData.imageSrc}
              onChange={(imageSrc) => setFormData({ ...formData, imageSrc })}
            />
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a catchy title for your listing"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your property in detail"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price per night (INR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                min="1"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-rose-500 hover:bg-rose-600" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating Listing...' : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
}
