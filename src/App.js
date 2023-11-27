import { useEffect, useState } from "react";
import WatchedMovieList from "./components/WatchedMovieList.js";
import WatchedSummary from "./components/WatchedSummary.js";
import MovieList from "./components/MovieList.js";
import Loader from "./components/Loader.js";
import ErrorMessage from "./components/ErrorMessage.js";
import NavBar from "./components/NavBar.js";
import NumResults from "./components/NumResults.js";
import Search from "./components/Search.js";
import MovieDetails from "./components/MovieDetails.js";
import { useMovies } from "./useMovies.js";

export const KEY = "6a49ff09";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  //custom hook
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  // lazy evaluation
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) || [];
  });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  // useEffect(function () {
  //   console.log("After initial render");
  // }, []);
  // useEffect(function () {
  //   console.log("After every render");
  // });
  // useEffect(
  //   function () {
  //     console.log("D");
  //   },
  //   [query]
  // );
  // console.log("During render");
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
