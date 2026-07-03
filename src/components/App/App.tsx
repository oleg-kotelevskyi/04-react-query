import { useState, useEffect, type ComponentType } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import ReactPaginateModule, { type ReactPaginateProps } from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '', 
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!query) return;

    if (isError && error) {
      toast.error('Failed to fetch movies. Please try again.');
    }

    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isError, error, query]);

  const handleSearchSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); 
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const totalPages = data && data.total_pages > 500 ? 500 : data?.total_pages || 0;

  const showPagination = totalPages > 1 && !isLoading && !isError;

  return (
    <div className={css.appContainer}>
      <Toaster position="top-right" reverseOrder={false} />

      <SearchBar onSubmit={handleSearchSubmit} />

      <main className={css.mainContent}>
        {isError && <ErrorMessage />}

        {isLoading && <Loader />}

        {data && data.results.length > 0 && (
          <div style={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 200ms' }}>
            <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
          </div>
        )}

        {showPagination && (
          <div className={css.paginationContainer}>
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => {
                setPage(selected + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
              pageClassName={css.pageItem}
              previousClassName={css.pageItem}
              nextClassName={css.pageItem}
              breakClassName={css.pageItem}
              breakLabel="..."
              disabledClassName={css.disabled}
            />
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

