const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./keys');
const config = require('./config');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

const app = express();

app.use(
   cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: keys.session.cookieKey
   })
);

//init passport
app.use(passport.initialize());
app.use(passport.session());

//connect to db
mongoose.connect(
   config.mongo.url,
   { useNewUrlParser: true },

   () => {
      console.log('connected to db');
   }
);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

//set up Auth Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(config.server.port, () => {
   console.log(`Running on port ${config.server.port}`);
});

module.exports = app;
