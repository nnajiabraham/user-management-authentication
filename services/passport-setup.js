// @ts-nocheck
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../keys');
const { User } = require('../models/user-model');

passport.use(
   new GoogleStrategy(
      {
         //options for strategy
         clientID: keys.googleLogin.clientID,
         clientSecret: keys.googleLogin.clientSecret,
         callbackURL: '/auth/google/redirect'
      },
      (accessToken, refreshToken, profile, done) => {
         console.log(profile);
         new User({
            username: profile.displayName,
            first_name: profile.name.familyName,
            last_name: profile.name.givenName,
            email: profile._json.email,
            google_id: profile.id,
            facebook_id: null,
            profile_picture: profile._json.picture
         })
            .save()
            .then(newUser => {
               //    console.log('created', newUser);
            });
      }
   )
);
