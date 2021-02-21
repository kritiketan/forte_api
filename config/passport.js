const passport = require('passport');
const axios = require('axios');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/user');


passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: 'Invalid email or password.' });
      });
    });
  }));

/**
 * Sign in with LinkedIn.
 */
passport.use(new LinkedInStrategy({
  clientID: "860ezpkd3wiglx",//process.env.LINKEDIN_ID,
  clientSecret: "3beARGv6nNfihbFm",//process.env.LINKEDIN_SECRET,
  callbackURL: 'http://localhost:4200/oauth/linkedin', //`${process.env.BASE_URL}/auth/linkedin/callback`,
  scope: ['r_liteprofile', 'r_emailaddress'],
  profileFields: ['id', 'first-name', 'last-name', 'email-address','public-profile-url'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ linkedin: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        //req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.linkedin = profile.id;
          user.tokens.push({ kind: 'linkedin', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile.photos[3].value;
          user.save((err) => {
            if (err) { return done(err); }
            req.flash('info', { msg: 'LinkedIn account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ linkedin: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.linkedin = profile.id;
          user.tokens.push({ kind: 'linkedin', accessToken });
          user.email = profile.emails[0].value;
          user.profile.name = profile.displayName;
          user.profile.picture = user.profile.picture || profile.photos[3].value;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

  /**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(302).send({
      success:false,
      message:'Unauthorized'
    })
  };
  
  
