import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchMovie, setSearchMovie] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movie', searchMovie, currentPage],
    queryFn: () => fetchMovies(searchMovie, currentPage),
    enabled: searchMovie !== "",
    placeholderData: keepPreviousData,
  });

  const onSubmit = (query: string) => {
    setMovies([]);
    setCurrentPage(1);
    setSearchMovie(query);
  };
  
  useEffect(() => {
    if (isSuccess) {
      setMovies(data.results);
    };
    
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }
  },[data, isSuccess]);


  const openModal = () => setIsOpenModal(true);
  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedMovie(null);
  }

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    openModal();
  }

  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center"/>
      <SearchBar onSubmit={onSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage/>}
      {data && data.results.length > 0 && <MovieGrid onSelect={handleSelectedMovie} movies={movies} />}
      {isOpenModal && selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </div>
  )
}

