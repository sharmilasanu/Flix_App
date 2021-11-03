const mongoose = require('mongoose');
let movieSchema = mongoose.Schema({
    Title : {type: String, required:true},
    Desc : {type: String, required:true},
    Genre : {
        Name : String,
        Description : String
    },
    Director : {
        Name : String,
        Bio :  String
    },
    Actors: [String],
  ImagePath: String,
  Featured: Boolean
});
let userSchema = mongoose.Schema({

    UserName : {type:String, required: true},
    Password : {type:String,required:true},
    Email : {type:String,required:true},
    Birthday : Date,
    FavoriteMovies : [{ type: mongoose.Schema.Types.ObjectId,ref :'Movie'}]
});

//  This will create collections called “db.movies” and “db.users” within the MongoDB database
let Movie = mongoose.model('Movie',movieSchema);
let User = mongoose.model('User',userSchema)

//exporting the modules to index.js
module.exports.Movie = Movie;
module.exports.User = User;