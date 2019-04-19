const moongose = require('mongoose');
const Schema = moongose.Schema;

const userSchema = new Schema({
   first_name: String,
   last_name: String,
   email: String,
   google_id: String,
   facebook_id: String,
   google_profile_picture: String,
   facebook_profile_picture: String,
   phone_numer: Number,
   verified_driver: Boolean
});

const User = moongose.model('user', userSchema);

module.exports = { User };
