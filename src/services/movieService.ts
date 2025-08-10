import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
    results: Movie[],
    total_pages: number
}

const MY_API = import.meta.env.VITE_TMDB_TOKEN;

const fetchMovies = async (query: string, page:number): Promise<MoviesHttpResponse> => {
    const response = await axios.get<MoviesHttpResponse>('https://api.themoviedb.org/3/search/movie',
        {
            params: {
                query,
                page,
             },
            headers: {
                Authorization: `Bearer ${MY_API}`,
            }
        });
    return response.data;
};

export default fetchMovies;