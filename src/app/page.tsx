'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
          { next: { revalidate: 3600 } } // Revalidate every hour
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (!session) {
      signIn('google');
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          {movies[0]?.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Unlimited movies, TV shows, and more
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Watch anywhere. Cancel anytime.
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-red-600 text-white px-8 py-4 rounded text-xl font-semibold hover:bg-red-700 transition"
              >
                {session ? 'Browse Movies' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Titles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
