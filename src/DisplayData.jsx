import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
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

const CREATE_USER_MUTATION = gql`
    mutation ($input: createUserInput!){
        createUser(input: $input){
            name
            id
        }
    }
`
const DELETE_USER_MUTATION = gql`
    mutation ($id: ID!){
        deleteUser(id: $id){
            id
        }
    }
`

function DisplayData() {
    
    const { data, loading, error } = useQuery(QUERY_ALL_USERS)
    const { data: movieData, loading: movieLoading } = useQuery(QUERY_ALL_Movies)
    const [movieSearched, setMovieSearched] = useState('')
    const [fetchMovie, { data: movieSearchedData, error: movieError }] = useLazyQuery(QUERY_MOVIE)
    const [createUser] = useMutation(CREATE_USER_MUTATION)
    const [handleDelete] = useMutation(DELETE_USER_MUTATION)
    
    // create user state
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [age, setAge] = useState("");
    const [nationality, setNationality] = useState("");
    console.log(name, username, age, nationality)

    if (loading, movieLoading) {
       return <h2>Loading....</h2>
    }

    // if (data) {
    //     console.log(data)
    // }

    // if (error) {
    //     console.log(error)
    // }
    
    // if (movieError) {
    //     console.log(movieError)
    // }

  return (
      <div>
          
          <div>
              <input type="text" placeholder='Name...' onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder='Username...' onChange={(e) => setUserName(e.target.value)} />
              <input type="number" placeholder='Age...' onChange={(e) => setAge(parseInt(e.target.value))} />
              <input type="text" placeholder='Nationality...' onChange={(e) => setNationality(e.target.value.toUpperCase())} />
              <button onClick={() => {
                  createUser({
                      variables: {
                  input: {name, age, username, nationality}
                      },
                      refetchQueries: [
                          {
                          query: QUERY_ALL_USERS
                      }
                  ]})
              }}>Create User</button>
          </div>

          <h1>All users list</h1>
          {
              data.users.map(user => <div key={user.id}>
                  <h4>Name: {user.name}</h4>
                  <h4>Username: {user.username}</h4>
                  <h4>Age: {user.age}</h4>
                  <h4>Nationality: {user.nationality}</h4>
                  <button onClick={() => {
                      handleDelete({
                          variables: {
                              id: user.id
                          },
                          refetchQueries: [
                              {
                                  query: QUERY_ALL_USERS
                              }
                          ]
                      })
                  }}>Delete</button>
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
