import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useState } from 'react';

const QUERY_ALL_USERS = gql`
    query Users {
        users {
            id 
            name 
            age 
            username
            nationality
        }
    }
`

const QUERY_ALL_Movies = gql`
    query Movies {
        movies {
            id 
            name 
        }
    }
`;
const QUERY_MOVIE = gql`
    query Movie($name: String!){
        movie(name: $name){
            name
            yearOfPublication
        }
    }
`

function DisplayData() {
    
    const { data, loading, error } = useQuery(QUERY_ALL_USERS)
    const { data: movieData } = useQuery(QUERY_ALL_Movies)
    const [movieSearched, setMovieSearched] = useState('')
    const [fetchMovie, {data: movieSearchedData, error: movieError}] = useLazyQuery(QUERY_MOVIE)

    if (loading) {
       return <h2>Loading....</h2>
    }

    // if (data) {
    //     console.log(data)
    // }

    if (error) {
        console.log(error)
    }
    
    if (movieError) {
        console.log(movieError)
    }

  return (
    <div>
          <h1>All users list</h1>
          {
              data.users.map(user => <div key={user.id}>
                  <h4>Name: {user.name}</h4>
                  <h4>Username: {user.username}</h4>
                  <h4>Age: {user.age}</h4>
                  <h4>Nationality: {user.nationality}</h4>
              </div>)
          }

<h1>All movies list</h1>
          {
              movieData.movies.map(movie => <div key={movie.id}>
                  <h3>Movie name: {movie.name}</h3>
              </div>)
          }
          

          <div>
              <input type="text" placeholder='Interstellar...' onChange={(e) => setMovieSearched(e.target.value)} />
              
              <button onClick={() => fetchMovie({
                  variables: {
                  name: movieSearched
              }})}>Fetch Data</button>
              <div>
                  {
                      movieSearchedData ? <div><h3>Movie name: {movieSearchedData.movie.name}</h3>
                          <h3>Year of Publication: {movieSearchedData.movie.yearOfPublication}</h3>
                      </div> : <h3>Please Search...</h3>
                  }
                  {/* {
                       movieSearchedData && <div><h3>Movie name: {movieSearchedData.movie.name}</h3>
                       <h3>Year of Publication: {movieSearchedData.movie.yearOfPublication}</h3>
                   </div>
                  } */}
                  {
                      movieError && <div>Not Found...</div>
                  }
              </div>
          </div>

    </div>
  )
}

export default DisplayData
