'use client';

import Image from 'next/image';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="relative group cursor-pointer">
      <div className="relative aspect-[2/3] transform transition-transform duration-300 group-hover:scale-105">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover rounded-lg shadow-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-lg flex items-end">
        <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold">{movie.title}</h3>
          <p className="text-gray-200 text-sm mt-1">
            {new Date(movie.release_date).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 