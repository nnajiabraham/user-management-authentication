const moongose = require('mongoose');
const Schema = moongose.Schema;

const userSchema = new Schema(
   {
      first_name: String,
      last_name: String,
      email: String,
      password: String,
      google_id: String,
      facebook_id: String,
      profile_picture: String,
      google_profile_picture: String,
      facebook_profile_picture: String,
      phone_number: Number,
      license_submitted: {
         type: Boolean,
         default: false
      },
      verified_driver: {
         type: Boolean,
         default: false
      }
   },
   { timestamps: true }
);

const User = moongose.model('user', userSchema);

module.exports = { User };
