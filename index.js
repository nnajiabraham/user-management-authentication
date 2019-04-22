const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
var flash = require('connect-flash');
const passport = require('passport');

const keys = require('./keys');
const config = require('./config');
const routes = require('./routes/index');

const app = express();

app.use(
   cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: keys.session.cookieKey
   })
);

app.use(flash());

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
app.use(routes);

app.listen(config.server.port, () => {
   console.log(`Running on port ${config.server.port}`);
});

module.exports = app;
