'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, topRatedRes, popularRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
        ]);

        const [trendingData, topRatedData, popularData] = await Promise.all([
          trendingRes.json(),
          topRatedRes.json(),
          popularRes.json(),
        ]);

        setTrendingMovies(trendingData.results.slice(0, 10));
        setTopRatedMovies(topRatedData.results.slice(0, 10));
        setPopularMovies(popularData.results.slice(0, 10));
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

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMovie(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleGetStarted = async () => {
    if (session) {
      await signIn('google', { callbackUrl: '/home', redirect: true });
    } else {
      router.push('/home');
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0"
          style={{
            willChange: 'transform',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          {popularMovies[0]?.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${popularMovies[0].backdrop_path}`}
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
                {session ? 'Get Started' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Sections */}
      <section id="movie-sections" className="bg-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Trending Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="flex-none w-64 snap-start" onClick={() => handleMovieClick(movie)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Rated Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top Rated</h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {topRatedMovies.map((movie) => (
                  <div key={movie.id} className="flex-none w-64 snap-start" onClick={() => handleMovieClick(movie)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Popular on Netflix</h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {popularMovies.map((movie) => (
                  <div key={movie.id} className="flex-none w-64 snap-start" onClick={() => handleMovieClick(movie)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/?autoplay=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300 bg-transparent p-2 rounded-full"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
