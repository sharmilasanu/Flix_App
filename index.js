const bodyParser = require('body-parser'),
express = require('express'),

morgan = require('morgan'),
mongoose = require('mongoose')
Models = require('./models.js')


//importing the models from Models.js
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connection Successful"))
.catch(err => console.log(err));



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const passport = require('passport');
require('./passport');
app.use(passport.initialize());

const cors = require('cors');
// will allow only certain regions to access this api
let allowedOrigins = ['http://localhost:8080', 'https://sharmismyflix.herokuapp.com','http://localhost:1234','http://localhost:4200','https://sharmilasanu.github.io' , 'https://sharmismyflix.netlify.app/'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
let auth = require('./auth')(app);
app.use(express.static('public'))
app.use(morgan('common'))

app.get('/', (req,res) => {
    res.send("welcome to flix app")
})
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});
// Gets list of movies
/*temporary for react ex 3.4
app.get('/movies', (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});*/
//actual with authentication


/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch all the movies - "url/movies"
 * @returns {object} - returns all the movies
 * @requires authentication JWT
 */
app.get('/movies', passport.authenticate('jwt', { session: false }),(req,res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})
/**
 * Get a movie by title
 * @method GET
 * @param {string} endpoint - endpoint to fetch a movie by title
 * @param {string} Title - is used to get a specific movie - "url/movies/:Title"
 * @returns {object} - returns the specific movie 
 * @requires authentication JWT
 */
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get a genre by it's name
 * @method GET
 * @param {string} endpoint - endpoint to fetch a genre by it's name
 * @param {string} Name - is used to get a specific genre - "url/genres/:Name"
 * @returns {object} - returns the specific genre
 * @requires authentication JWT
 */
app.get('/genre/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name' : req.params.Name})
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get a director by name
 * @method GET
 * @param {string} endpoint - endpoint to fetch a director by name
 * @param {string} Name - is used to get a specific director - "url/directors/:Name"
 * @returns {object} - returns the specific director
 * @requires authentication JWT
 */
app.get('/movies/director/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name' : req.params.Name})
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get all users
 * @method GET
 * @param {string} endpoint - endpoint to fetch all users - "url/users"
 * @returns {object} - returns all the users
 * @requires authentication JWT
 */
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint to fetch user by username
 * @param {string} UserName - is used to get a specific user - "url/users/:Username"
 * @returns {object} - returns the specific user
 * @requires authentication JWT
 */

app.get('/users/:UserName', (req, res) => {
  Users.findOne({ UserName: req.params.UserName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Create a new user
 * @method POST
 * @param {string} endpoint - endpoint to create a new user - "url/users"
 * @param {string} UserName - username choosen by user
 * @param {string} Password - password choosen by user
 * @param {string} Email - email choosen by user
 * @param {string} Birthday - birthday choosen by user
 * @returns {object} - returns the new created user
 */
app.post('/users',
  // Validation logic here for request 
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('UserName', 'Username length should be from 5').isLength({min: 5}),
    check('UserName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ UserName: req.body.UserName }) // Search to see if a user with the requested username already exists
    .then((user) => {
     /* if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.UserName + ' already exists');
      } else {*/
        Users.create({
            UserName: req.body.UserName,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          }
          );
     // }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * Update user by username
 * @method PUT
 * @param {string} endpoint - endpoint to update a user - "url/users/:Username"
 * @param {string} UserName - user's new username or same if left empty
 * @param {string} Password - user's new password or same if left empty
 * @param {string} Email - user's new email or same if left empty
 * @param {string} Birthday - user's new birthday or same if left empty
 * @returns {object} - returns the new updated user
 * @requires authentication JWT
 */
app.put('/users/:UserName', (req, res) => {
  Users.findOneAndUpdate(
    {UserName: req.params.UserName}, 
    {
    $set: {
      UserName: req.body.UserName,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites - "url/users/:Username/movies/MovieID"
 * @param {string} UserName - is used to find a specific user
 * @param {string} MovieID - is used to add a movie's id to the user's favorites 
 * @returns {string} - returns success or error message
 */
app.post('/users/:UserName/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({UserName: req.params.UserName}, 
    {
      $push: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
      console.log (updatedUser)
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });

});
/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to add movies to favorites - "url/users/:Username/movies/MovieID"
 * @param {string} UserName - is used to find a specific user
 * @param {string} MovieID - is used to add a movie's id to the user's favorites 
 * @returns {string} - returns success or error message
 */
app.delete('/users/:UserName/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({UserName: req.params.UserName}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Delete user by username
 * @method DELETE
 * @param {string} endpoint - endpoint to delete a user
 * @param {string} UserName - is used to delete a specific user - "url/users/:Username"
 * @returns {string} success or error message
 * @requires authentication JWT
 */

app.delete('/users/:UserName', (req, res) => {
  Users.findOneAndRemove({ UserName: req.params.UserName})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.UserName + ' was not found.');
    } else {
      res.status(200).send(req.params.UserName + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });



const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
