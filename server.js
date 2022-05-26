const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
  client: 'pg',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('GET success'));

// repetitions can be seen from these 2 lines of code
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

// below are some examples of using 'Currying', it reduces repetitions
app.put('/image', image.handleImage(db));
app.post('/image/clarifaiApiCall', image.handleClarifaiApiCall);
app.get('/profile/:id', profile.handleProfile(db));

let port = process.env.PORT;
if (port === null || port === '') {
  port = 3000;
}

app.listen(port, (err) => {
  if (!err) {
    console.log(`app is running on port ${port}`);
  } else {
    console.log(err)
  }
});

/*
  /
  --> GET
  --> res database

  /signin
  --> POST
  --> res user

  /register
  --> POST
  --> res user

  /image
  --> PUT
  --> update entries
  --> res user

  /profile/:id
  --> GET
  --> res user
*/ 