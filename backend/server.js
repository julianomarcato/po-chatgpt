// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(session({ secret: 'uma_chave_aleatoria', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

// Rotas de autenticação Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:4200/login',
    successRedirect: 'http://localhost:4200'
  })
);

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('http://localhost:4200'));
});

// Middleware de autenticação
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ erro: 'Usuário não autenticado' });
}

// Teste sessão
app.get('/api/test-session', (req, res) => res.json({ user: req.user || null }));

// Retorna IAs disponíveis
app.get('/api/ais', (req, res) => {
  const ais = Object.keys(process.env)
    .filter(key => key.endsWith('_API_KEY'))
    .map(key => key.replace('_API_KEY', '').toLowerCase());
  res.json({ ais });
});

// Endpoint multi-IA
app.post('/api/prompt', ensureAuthenticated, async (req, res) => {
  try {
    const { prompt, ai } = req.body;
    if (!prompt || !ai) return res.status(400).json({ erro: 'Prompt ou IA não fornecidos' });

    const apiKey = process.env[`${ai.toUpperCase()}_API_KEY`];
    if (!apiKey) return res.status(400).json({ erro: 'IA não configurada' });

    let response;

    switch (ai) {
      case 'gpt':
        response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }]
        }, { headers: { Authorization: `Bearer ${apiKey}` } });
        return res.json({ resposta: response.data.choices[0].message.content });

      case 'deepseek':
        response = await axios.post('https://api.deepseek.ai/query', { prompt }, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        return res.json({ resposta: response.data.answer });

      case 'gemini':
        response = await axios.post('https://api.gemini.ai/chat', { prompt }, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        return res.json({ resposta: response.data.response });

      default:
        return res.status(400).json({ erro: 'IA não reconhecida' });
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ erro: err.response?.data || err.message });
  }
});

// Servir Angular build
const angularDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(angularDistPath));

// Rota coringa para Angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
