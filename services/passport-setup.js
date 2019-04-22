// @ts-nocheck
const bcrpyt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
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

//LocalStrategy
passport.use(
   new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
         .then(user => {
            if (!user) {
               done(null, false, { message: 'Incorrect email or password' });
            } else {
               bcrpyt.compare(password, user.password, (err, isMatch) => {
                  if (err) throw err;

                  if (!isMatch) {
                     return done(null, false, {
                        message: 'Incorrect email or password'
                     });
                  }
                  const token = jwt.sign(
                     {
                        email: user.email,
                        id: user._id.toString()
                     },
                     keys.session.cookieKey[0],
                     { expiresIn: '1h' }
                  );

                  return done(null, user, { message: 'success' });
               });
            }
         })
         .catch(err => console.log(err));
   })
);

//googleStrategy
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
               if (currentUser.google_id) {
                  console.log('User is logged in with google');
                  done(null, currentUser);
               } else {
                  currentUser.google_id = profile._json.sub;
                  currentUser.google_profile_picture = profile._json.picture;
                  currentUser.save().then(user => {
                     console.log('updated user google id/profile');
                     done(null, currentUser);
                  });
               }
            } else {
               new User({
                  first_name: profile._json.given_name,
                  last_name: profile._json.family_name,
                  email: profile._json.email,
                  google_id: profile._json.sub,
                  facebook_id: null,
                  google_profile_picture: profile._json.picture,
                  facebook_profile_picture: null,
                  phone_number: null
               })
                  .save()
                  .then(newUser => {
                     console.log('new google user created');
                     done(null, newUser);
                  });
            }
         });
      }
   )
);

//facebookStrategy
passport.use(
   new FacebookStrategy(
      {
         clientID: keys.facebookLogin.appID,
         clientSecret: keys.facebookLogin.appSecret,
         callbackURL: '/auth/facebook/redirect',
         profileFields: [
            'id',
            'displayName',
            'picture',
            'email',
            'first_name',
            'last_name'
         ]
      },
      (accessToken, refreshToken, profile, done) => {
         // check if user exist in db
         User.findOne({ email: profile._json.email }).then(currentUser => {
            if (currentUser) {
               console.log('User is logged in with facebook');
               if (currentUser.facebook_id) {
                  //update profile picture URL
                  currentUser.facebook_profile_picture =
                     profile._json.picture.data.url;
                  currentUser.save().then(user => {
                     console.log('updated user facebook profilepic');
                     done(null, currentUser);
                  });
               } else {
                  currentUser.facebook_id = profile._json.id;
                  currentUser.facebook_profile_picture =
                     profile._json.picture.data.url;
                  currentUser.save().then(user => {
                     console.log('updated user facebook id/profilepic');
                     done(null, currentUser);
                  });
               }
            } else {
               new User({
                  first_name: profile._json.first_name,
                  last_name: profile._json.last_name,
                  email: profile._json.email,
                  google_id: null,
                  facebook_id: profile._json.id,
                  google_profile_picture: null,
                  facebook_profile_picture: profile._json.picture.data.url,
                  phone_number: null
               })
                  .save()
                  .then(newUser => {
                     console.log('new facebook user created');
                     done(null, newUser);
                  });
            }
         });
      }
   )
);
