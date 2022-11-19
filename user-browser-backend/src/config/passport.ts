const passport = require("passport");
const config = require("./config").default;
const SamlStrategy = require('passport-saml').Strategy;

  //Passport SAML strategy definition.
  //Tells passport to use our config.passport.saml
  //Also indicates that when a user is authenticated, their data should be returned as mapped below.
  //This data will be accessible as an object: req.user
  passport.use(new SamlStrategy(
    config.passport.saml,
    function (profile : any, done : any) {
      return done(null,
        {
          id: profile.nameID,
          email: profile.nameID,
          displayName: profile.nameID,
          firstName: profile.nameID,
          lastName: profile.nameID,
        });
    })
  );

  //Functions to push data into and out of our session objects
  //These are called internally by passport 
  passport.serializeUser(function(user : any, done : any) {
    done(null, user); 
  });
  
  passport.deserializeUser(function(user : any, done : any) {
    done(null, user); 
  });

export default passport;