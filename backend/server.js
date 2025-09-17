// backend/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./auth');
const chatRoutes = require('./chat-gpt');


const app = express();
const PORT = 3000;

console.log('=== SERVIDOR INICIADO ===');
console.log(`Porta: ${PORT}`);
console.log('Frontend: http://localhost:4200');
console.log('=========================');

// Configuração CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rota de chat
app.use('/api', chatRoutes);

// Rota para verificar usuário logado
app.get('/api/user', (req, res) => {
  console.log('📌 [REQ] GET /api/user');
  if (req.isAuthenticated()) {
    console.log('🔑 Desserializando usuário:', req.user.displayName);
    res.json({ authenticated: true, user: req.user });
  } else {
    console.log('❌ Usuário não autenticado');
    res.status(401).json({ authenticated: false });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    console.log('🔴 Usuário deslogado');
    res.redirect('http://localhost:4200/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log('Servidor rodando em', PORT);
});
