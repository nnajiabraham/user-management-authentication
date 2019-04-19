// @ts-nocheck
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../keys');
const { User } = require('../models/user-model');

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.findById(id).then(user => {
      done(null, user);
   });
});

passport.use(
   new GoogleStrategy(
      {
         //options for strategy
         clientID: keys.googleLogin.clientID,
         clientSecret: keys.googleLogin.clientSecret,
         callbackURL: '/auth/google/redirect'
      },
      (accessToken, refreshToken, profile, done) => {
         //used to verify accesstoken
         //https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=accessToken

         //check if user exist in db
         User.findOne({ email: profile._json.email }).then(currentUser => {
            if (currentUser) {
               console.log('User is ', currentUser);
               done(null, currentUser);
            } else {
               new User({
                  username: profile.displayName,
                  first_name: profile.name.givenName,
                  last_name: profile.name.familyName,
                  email: profile._json.email,
                  google_id: profile.id,
                  facebook_id: null,
                  profile_picture: profile._json.picture
               })
                  .save()
                  .then(newUser => {
                     console.log('new user created', newUser);
                     done(null, newUser);
                  });
            }
         });
      }
   )
);
