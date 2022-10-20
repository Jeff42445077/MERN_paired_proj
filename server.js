const express = require('express');
const mongoose = require('mongoose');

const users = require('./Routes/API/users');
const profile = require('./Routes/API/profile');
const posts = require('./Routes/API/posts');

const app = express();

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
app.use('/API/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
