// backend/auth.js
const express = require('express');
const router = express.Router(); // ← Cria o router
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = router;

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  console.log('✅ Google auth success:', profile.displayName);
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  console.log('📝 Serializando usuário:', user.id);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log('🔑 Desserializando usuário:', obj.id);
  done(null, obj);
});

// Login Google
router.get('/google', (req, res, next) => {
  console.log('➡ Chamando rota /auth/google');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:4200/login',
}), (req, res) => {
  console.log('🟢 Auth bem-sucedida, redirecionando para /chat');
  res.redirect('http://localhost:4200/chat');
});

module.exports = router;
