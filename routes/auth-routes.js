const router = require('express').Router();
const passport = require('passport');

const signupController = require('../controllers/auth');

// require strategy so google strategy file runs
const passportSetup = require('../services/passport-setup');

const userInfo = ({
   license_submitted,
   verified_driver,
   _id,
   first_name,
   last_name,
   email,
   phone_number,
   createdAt,
   updatedAt,
   google_profile_picture,
   facebook_profile_picture
}) => {
   return {
      license_submitted,
      verified_driver,
      _id,
      first_name,
      last_name,
      email,
      phone_number,
      createdAt,
      updatedAt,
      google_profile_picture,
      facebook_profile_picture
   };
};

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

//auth with facebook
router.get(
   '/facebook',
   passport.authenticate('facebook', {
      scope: ['email', 'public_profile']
   })
);

router.get('/local', (req, res) => {
   res.status(401).json(req.flash());
});

//For local strategy
router.post(
   '/local',
   passport.authenticate('local', {
      failureRedirect: 'local',
      failureFlash: true
   }),
   (req, res) => {
      res.json({ ...userInfo(req.user), ...req.flash() });
      // res.redirect('/profile');
   }
);

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
   // res.redirect('/profile');
   res.json(userInfo(req.user));
});

//callback route for facebook redirect
router.get(
   '/facebook/redirect',
   passport.authenticate('facebook'),
   (req, res) => {
      res.json(userInfo(req.user));
      // res.redirect('/profile');
   }
);

router.post(
   '/signup',
   signupController.signupValidator,
   signupController.signup
);

module.exports = router;
