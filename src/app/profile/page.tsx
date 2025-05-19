'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex items-center gap-6">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {session.user?.name}
              </h1>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Account Details
            </h2>
            <div className="grid gap-4">
              <div className="bg-zinc-800 p-4 rounded">
                <h3 className="text-sm font-medium text-gray-400">Member since</h3>
                <p className="text-white">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 