const router = require('express').Router();

const authCheck = (req, res, next) => {
   if (!req.user) {
      res.redirect('/auth/login');
   }
   next();
};

router.get('/', authCheck, (req, res) => {
   res.send('logged in user is ' + req.user.first_name);
});

module.exports = router;
