const moongose = require('mongoose');
const Schema = moongose.Schema;

const userSchema = new Schema({
   username: String,
   first_name: String,
   last_name: String,
   email: String,
   google_id: String,
   facebook_id: String,
   profile_picture: String
});

const User = moongose.model('user', userSchema);

module.exports = { User };
