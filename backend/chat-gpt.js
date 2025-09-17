// backend/chat-gpt.js
const express = require('express');
const router = express.Router(); // ← Cria o router
module.exports = router;

// Middleware para checar login
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Usuário não autenticado' });
}

router.post('/prompt', ensureAuth, (req, res) => {
  console.log('📌 [REQ] POST /api/prompt');
  const { prompt, selectedAI } = req.body;

  console.log(`💬 Prompt recebido: ${prompt} | AI: ${selectedAI}`);

  // Simulação de resposta
  if (selectedAI === 'Gemini') {
    res.json({ resposta: `Resposta do Gemini: ${prompt}` });
  } else {
    console.log('❌ Erro no prompt: saldo insuficiente ou AI indisponível');
    res.status(400).json({
      error: 'Insufficient Balance or AI unavailable'
    });
  }
});

module.exports = router;
