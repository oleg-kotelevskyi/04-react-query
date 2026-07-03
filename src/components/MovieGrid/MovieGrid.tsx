import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {

  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <ul className={css.grid}>
          {movies.map((movie) => {
          
        const posterUrl = movie.poster_path 
          ? `${BASE_IMAGE_URL}${movie.poster_path}` 
          : 'https://dummyimage.com';

        return (
          <li key={movie.id} onClick={() => onSelect(movie)}>
            <div className={css.card}>
              <img
                className={css.image}
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
