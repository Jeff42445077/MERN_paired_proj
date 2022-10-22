const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./Routes/api/users');
const profile = require('./Routes/api/profile');
const post = require('./Routes/api/post');

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

app.get('/', (req, res) => res.send('What is up'));

// Use Routes
app.use('/API/users', users);
app.use('/API/profile', profile);
app.use('/API/post',post);

// listen for requests
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
