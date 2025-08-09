import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
    results: Movie[]
}

interface fetchMoviesParams {
    query: string;
}

const MY_API = import.meta.env.VITE_TMDB_TOKEN;

const fetchMovies = async ({ query }: fetchMoviesParams) => {
    const response = await axios.get<MoviesHttpResponse>('https://api.themoviedb.org/3/search/movie',
        {
            params: { query },
            headers: {
                Authorization: `Bearer ${MY_API}`,
            }
        });
    return response.data.results
};

export default fetchMovies;