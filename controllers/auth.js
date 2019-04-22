const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user-model');
const { body } = require('express-validator/check');

exports.signup = (req, res, next) => {
   const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirm_password
   } = req.body;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      const error = new Error('validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      res.status(422).json(error);

      // return to avoid node from complaining about sending two response due to event loop
      return;
   }

   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hashedPwd) => {
         if (err) throw err;
         const user = new User({
            first_name,
            last_name,
            email,
            password: hashedPwd,
            phone_number
         });
         user
            .save()
            .then(result => {
               res.status(201).json({
                  message: 'User created!',
                  userId: result._id
               });
            })
            .catch(err => console.log(err));
      });
   });
};

exports.signupValidator = [
   body('first_name')
      .trim()
      .not()
      .isEmpty(),
   body('last_name')
      .trim()
      .not()
      .isEmpty(),
   body('phone_number')
      .optional()
      .isInt(),
   body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
         return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
               return Promise.reject('Email address already exists!');
            }
         });
      })
      .normalizeEmail(),
   body('password')
      .trim()
      .isLength({ min: 6 }),
   body('confirm_password')
      .trim()
      .custom((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error('Passwords do not match');
         } else {
            return true;
         }
      })
];
