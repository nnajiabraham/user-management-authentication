const router = require('express').Router();

const authRoutes = require('./auth-routes');
const profileRoutes = require('./profile-routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
