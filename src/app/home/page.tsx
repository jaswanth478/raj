"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";
import { on } from "events";
import { get } from "http";
import { promises } from "dns";

export default function HomePage() {
  const [bestMovies, setBestMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const { data: session, status } = useSession();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status != "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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

        // Pick 4 best movies from top rated
        setBestMovies(topRatedData.results.slice(0, 4));
        setTrendingMovies(trendingData.results.slice(0, 10));
        setTopRatedMovies(topRatedData.results.slice(4, 14));
        setPopularMovies(popularData.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const getTrailerUrl = async (title: string): Promise<string> => {
    try {
      const apiKey = "AIzaSyAvsIJQ8-AvVQG7_fTuoUvryZVUC5ydqag";  // Ensure your API key is valid and secured
      const query = encodeURIComponent(`${title} trailer`);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        console.log("Video ID: ->>>>>>>>>>>>>", videoId);

        // Construct the embed URL using the video ID
        const trailerUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        console.log("Trailer URL: ", trailerUrl);


        return (videoId); // Set the video ID in state
      }

      return ""
      
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return "";

    }
  };

  const handleClick = async (movie: any) => {
    try {
      const trailerUrl: any = await getTrailerUrl(movie.title);

    
      if (trailerUrl != "") {
        setVideoId(trailerUrl);
        setSelectedMovie(movie);
      }// Minimal delay, simulating waiting for state update}
    }
      catch (error) {
        console.error("Error handling click:", error);
      }
  };
  

  
  


  return (
    <main className="min-h-screen">
      {/* Hero: Big Scrolling Best Movies */}
      <section className="relative w-full h-[80vh] overflow-x-auto flex gap-8 pb-8 snap-x snap-mandatory">
        {bestMovies.map((movie) => (
          <div
            key={movie.id}
            className="relative flex-none w-[70vw] h-full rounded-2xl overflow-hidden shadow-lg snap-start"
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{movie.title}</h2>
              <p className="text-lg text-gray-200 line-clamp-3 drop-shadow">{movie.overview}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Movie Sections */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Trending Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {trendingMovies.map((movie) => (
                
                <div key={movie.id} onClick={() => { handleClick(movie) }}  className="flex-none w-64 snap-start"> 
                  
                  <MovieCard movie={movie}/>
                </div>
              ))}
            </div>
          </div>
          {/* Top Rated Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top Rated</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {topRatedMovies.map((movie) => (
                <div key={movie.id} onClick={() =>  handleClick(movie) } className="flex-none w-64 snap-start">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
          {/* Popular Movies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Popular on Netflix</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {popularMovies.map((movie) => (
                <div key={movie.id} onClick={() => { handleClick(movie) }} className="flex-none w-64 snap-start">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
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
