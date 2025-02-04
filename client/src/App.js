import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import MovieList from './components/MovieList';
import Movie from './components/Movie';

import MovieHeader from './components/MovieHeader';
import DeleteMovieModal from "./components/DeleteMovieModal";

import AddMovieForm from "./components/AddMovieForm";
import EditMovieForm from './components/EditMovieForm';
import FavoriteMovieList from './components/FavoriteMovieList';

import axios from 'axios';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/api/movies')
      .then(res => {
        setMovies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  //update favorites when edits happen
  useEffect( () => {
    const newFavorites = movies.filter(movie => {
      return favoriteMovies.find(favMovie => movie.id === favMovie.id)
    })

    console.log(newFavorites)
    setFavoriteMovies(newFavorites)
  }, [movies])

  const deleteMovie = (id)=> {
    axios.delete(`http://localhost:5000/api/movies/${id}`)
      .then( res => {
        const modMovies = movies.filter(movie => movie.id !== res.data)
        setMovies(modMovies);
        //If in favorites list and then deleted
        if (favoriteMovies.find(favMovie => favMovie.id === res.data)){
          const newFavorites = favoriteMovies.filter(favorite => favorite.id !== res.data)
          setFavoriteMovies(newFavorites);
        }
      })
      .catch( err => {
        console.log(err)
      })
  }

  const addToFavorites = (movie) => {
    if (favoriteMovies.find(favMovie => favMovie.id === movie.id)){
      return alert("Movie already exists in favorites list!")
    }
    setFavoriteMovies([...favoriteMovies, movie])
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand" ><img width="40px" alt="" src="./Lambda-Logo-Red.png"/> HTTP / CRUD Module Project</span>
      </nav>

      <div className="container">
        <MovieHeader/>
        <div className="row ">
          <FavoriteMovieList favoriteMovies={favoriteMovies}/>
        
          <Switch>
          <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies}/>
            </Route>

            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie deleteMovie={deleteMovie} addToFavorites={addToFavorites}/>
            </Route>

            <Route path="/movies">
              <MovieList movies={movies}/>
            </Route>

            <Route path="/">
              <Redirect to="/movies"/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};


export default App;

