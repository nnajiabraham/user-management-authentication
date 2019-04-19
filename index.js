const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');
const authRoutes = require('./routes/auth-routes');

const app = express();

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

app.listen(config.server.port, () => {
   console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;
