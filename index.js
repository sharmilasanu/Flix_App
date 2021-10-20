const express = require('express'),
     morgan = require('morgan')
     let moviesList = [
        {
          title: 'Harry Potter and the Sorcerer\'s Stone',
          director: 'J.K. Rowling'
        },
        {
          title: 'Lord of the Rings',
          director: 'J.R.R. Tolkien'
        },
        {
          title: 'Twilight',
          director: 'Stephanie Meyer'
        },
        {
            title: 'Harry Potter and the Sorcerer\'s Stone',
            director: 'J.K. Rowling'
          },
          {
            title: 'Lord of the Rings',
            director: 'J.R.R. Tolkien'
          },
          {
            title: 'Twilight',
            director: 'Stephanie Meyer'
          },
          {
            title: 'Harry Potter and the Sorcerer\'s Stone',
            director: 'J.K. Rowling'
          },
          {
            title: 'Lord of the Rings',
            director: 'J.R.R. Tolkien'
          },
          {
            title: 'Twilight',
            director: 'Stephanie Meyer'
          }
      ];
const app = express();
app.use(morgan('common'))

//app.use('/documentation', express.static('public'))
app.get('/', (req,res) => {
    res.send("welcome to flix app")
})
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});
app.get('/movies', (req,res) => {
    res.json(moviesList)
})
//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });