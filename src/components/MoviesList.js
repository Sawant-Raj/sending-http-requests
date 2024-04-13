import React from "react";

import Movie from "./Movie";
import classes from "./MoviesList.module.css";

const MoviesList = (props) => {
  const deleteHandler = (movieId) => {
    props.onDeleteMovie(movieId);
  };

  return (
    <>
      <ul className={classes["movies-list"]}>
        {props.movies.map((movie) => (
          <Movie
            key={movie.id}
            title={movie.title}
            releaseDate={movie.releaseDate}
            openingText={movie.openingText}
            onDelete={() => deleteHandler(movie.id)} //  Pass a reference to deleteHandler
          />
        ))}
      </ul>
    </>
  );
};

export default MoviesList;
