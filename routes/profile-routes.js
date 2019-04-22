const router = require('express').Router();

const authCheck = (req, res, next) => {
   if (!req.user || !req.isAuthenticated()) {
      res.redirect('/auth/login');
   }
   next();
};

router.get('/', authCheck, (req, res) => {
   res.send('logged in user is ' + JSON.stringify(req.user));
});

module.exports = router;
