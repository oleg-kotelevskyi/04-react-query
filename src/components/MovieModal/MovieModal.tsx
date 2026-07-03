import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const imageUrl = movie.backdrop_path 
    ? `${BASE_IMAGE_URL}${movie.backdrop_path}` 
    : `${BASE_IMAGE_URL}${movie.poster_path}`;

  return createPortal(
    <div 
      className={css.backdrop} 
      role="dialog" 
      aria-modal="true" 
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button 
          className={css.closeButton} 
          aria-label="Close modal" 
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
