'use client';

import { useState, Suspense } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Search, Globe, User } from 'lucide-react';
import { SearchModal } from './search-modal';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <div className="w-full bg-white z-10 shadow-sm">
        <div className="py-4 border-b-[1px]">
          <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
              {/* Logo */}
              <Link href="/" className="hidden md:block cursor-pointer">
                <div className="text-2xl font-bold text-rose-500">airbnb</div>
              </Link>

              {/* Search */}
              <div 
                className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="text-sm font-semibold px-6">Anywhere</div>
                  <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    Any Week
                  </div>
                  <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">Add Guests</div>
                    <div className="p-2 bg-rose-500 rounded-full text-white">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="relative">
                <div className="flex flex-row items-center gap-3">
                  <Link
                    href="/become-a-host"
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                  >
                    Airbnb your home
                  </Link>
                  <div className="border-[1px] border-neutral-200 rounded-full hover:shadow-md transition">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 rounded-full px-3 flex items-center gap-2">
                          <Menu size={18} />
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={session?.user?.image || ''} />
                            <AvatarFallback>
                              <User size={16} />
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        {session ? (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/bookings">My trips</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/favorites">My favorites</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/properties">My properties</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/become-a-host">Airbnb my home</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                              Sign out
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/sign-in">Sign in</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/sign-up">Sign up</Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </Suspense>
    </>
  );
}
