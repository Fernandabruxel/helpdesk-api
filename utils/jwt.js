require('dotenv').config();
const jwt = require('jsonwebtoken');

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { gerarToken, verificarToken };