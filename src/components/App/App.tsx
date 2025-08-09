import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const onSubmit = async (query: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
      const movieData = await fetchMovies({ query });
      setIsLoading(false);
      setMovies(movieData);

      if (movieData.length === 0) {
        toast.error("No movies found for your request.");
        return
      };
    }
    catch {
      setIsError(true);
    }
  };

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedMovie(null);
  }

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    openModal();
  }

  return (
    <div className={css.app}>
      <Toaster position="top-center"/>
      <SearchBar onSubmit={onSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage/>}
      {movies.length > 0 && <MovieGrid onSelect={handleSelectedMovie} movies={movies} />}
      {isOpenModal && selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </div>
  )
}

