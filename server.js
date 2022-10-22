const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./Routes/API/users');
const profile = require('./Routes/API/profile');
const post = require('./Routes/API/post');

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//passport middleware

app.use(passport.initialize());

//passport Config

require ('./config/passport')(passport);

// Use Routes
app.use('/API/users', users);
app.use('/API/profile', profile);
app.use('/API/post',post);

// listen for requests
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
