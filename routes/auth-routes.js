const router = require('express').Router();
const passport = require('passport');

// require strategy so google strategy file runs
const passportSetup = require('../services/passport-setup');

//auth-login
router.get('/login', (req, res) => {
   res.json({ message: 'welcome to login page' });
});

//auth-logout
router.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/auth/login');
});

//auth with google
router.get(
   '/google',
   passport.authenticate('google', {
      //scope: this is what information you want from google
      scope: ['email', 'profile']
   })
);

//auth with google
router.get(
   '/facebook',
   passport.authenticate('facebook', {
      //scope: this is what information you want from google
      scope: ['email', 'public_profile']
   })
);

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
   res.redirect('/profile');
});

//callback route for facebook redirect
router.get(
   '/facebook/redirect',
   passport.authenticate('facebook'),
   (req, res) => {
      //   res.json(req.user);
      res.redirect('/profile');
   }
);

module.exports = router;
