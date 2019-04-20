/*
This file is a template of how the key object should be structured and
what properties the application needs. make a copy of this file in main directory
with the file name as keys.js
*/

module.exports = {
   googleLogin: {
      clientID: '{GOOGLE_CLIENT_ID}',
      clientSecret: '{GOOGLE_CLIENT_SECRET}'
   },
   facebookLogin: {
      appID: 'APP_ID',
      appSecret: 'APP_SECRET'
   },
   session: {
      cookieKey: ['{COOKIE_SECRETKEY}']
   }
};
