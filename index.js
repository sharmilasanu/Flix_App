const express = require('express'),
morgan = require('morgan')
     let moviesList = [
        {
          title: 'Harry Potter and the Sorcerer\'s Stone',
          
          description : 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling',
          genre : 'Fantasy Fiction',
          imageUrl : '',
          director: {
            name :'J.K. Rowling',
            bio : '',
            birth_year : 1978,
            death_year : 1994
          }
        },
        {
          title: 'Lord of the Rings',
         
          description : 'Lord of the Rings is a series of three epic fantasy adventure films',
          genre : 'Fantasy Fiction',
          imageUrl : '',
          director: {
            name :'Peter Jackson',
            bio : '',
            birth_year : 1978,
            death_year : 1994
          }
        },
        {
          title: 'Twilight',
          description : 'The Twilight Saga is a series of five vampire-themed romance fantasy films',
          genre : 'Fantasy Fiction',
          imageUrl : '',
          director: {
            name :'Stephanie Meyer',
            bio : '',
            birth_year : 1978,
            death_year : 1994
          }
        },
        {
          title: 'Frozen',
          description : 'Frozen is a 2013 American computer-animated musical fantasy film',
          genre : 'Fantasy',
          imageUrl : '',
          director: {
            name :'Adam Green',
            bio : '',
            birth_year : 1978,
            death_year : 1994
          }
        },
        {
          title: 'Oceans eleven',
          description : 'Oceans Eleven is a 2001 American heist comedy film',
          genre : 'Heist',
          imageUrl : '',
          director: {
            name :'Jerry Weintraubn',
            bio : '',
            birth_year : 1978,
            death_year : 2001
        }
      }
      ];
      let userList = [
        {
        name : 'dfa',
        password : 'ad',
        dob : 1994,
        email  : 'sdf@gmail.com'
        }
      ]
const app = express();
app.use(express.static('public'))
app.use(morgan('common'))

app.get('/', (req,res) => {
    res.send("welcome to flix app")
})
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});
// Gets list of movies
app.get('/movies', (req,res) => {
    res.json(moviesList)
})
// Gets data of movie by name/title
app.get('/movies/:title', (req, res) => {
  res.json(moviesList.find((movie) =>
    { return movie.title === req.params.title }));
});

//gets genre of the movie by using movie name/title
app.get('/movies/:genre', (req, res) => {
  res.send('Successful get returning the genre according to the movie title');
});

// gets data about director 
app.get('/movies/director/:name', (req, res) => {
  res.send('Successful get returning the data about the director');
});

// Adds a new users
app.post('/users', (req, res) => {
  res.send('Successful post request adding a new user');
});
//adds a favorite movie
app.post('/users/:id/favoritres', (req, res) => {
  res.send('Successful post request adding a favorite movie on the user list');
});
//deletes the favorite movies
app.delete('/users/:id/favoritres', (req, res) => {
  res.send('Successful delete request removing a favorite movie from the user list');
});

app.put('/users/:id/user_info', (req, res) => {
  res.send('Successful put request updating the user information');
});
app.delete('/users/:id', (req, res) => {
  res.send('Successful delete request deleting the user account');
});


//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });