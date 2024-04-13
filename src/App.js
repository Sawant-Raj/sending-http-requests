import React, { useState, useCallback, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null); // clear previous errors
    try {
      const response = await fetch(
        "https://react-http-requests-2e42c-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      ); // response is an object
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      // console.log(data);

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
        // console.log("KEYS are"+key);
      }

      // const transformedMovies = data.results.map((movieData) => ({
      //   id: movieData.episode_id,
      //   title: movieData.title,
      //   openingText: movieData.opening_crawl,
      //   releaseDate: movieData.release_date,
      // }));

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      setTimeout(fetchMoviesHandler, 5000); // Retry after 5 seconds if there's an error
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // chal to useEffect(() => {fetchMoviesHandler();},[]); se bhi jayega but best practice ye h ki array of dependencies me saari dependency add ki or depend kr rha h fetchMoviesHandler par but agar fetchMoviesHandler directly daal diya to kya hoga ki state update hogi to compoent re-render karega or JS me funs are objs so re-rendering me fun change hoga jiski wajah se useEffect me infinite loop create ho jayega isse bachne ke liye useCallback use kr rhe hain or fetchMoviesHandler function me koi dependency nhi h to udhar empty array rkh diya h. With this, we have ensured that fetchMoviesHandler fun is not re-created unnecessarily.

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-requests-2e42c-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie), // converts JS obj or arr into JSON format
        headers: {
          "Content-Type": "application/json",
        }, // header not required for Firebase
      }
    );

    const data = await response.json(); //data coming from Firebase
    // console.log(data);
  }

  async function deleteMovieHandler(movieId) {
    await fetch(
      `https://react-http-requests-2e42c-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${movieId}.json`,
      {
        method: "DELETE",
      }
    );

    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
};

export default App;
