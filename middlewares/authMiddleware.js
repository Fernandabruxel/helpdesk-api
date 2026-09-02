const { verificarToken } = require('../utils/jwt');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token de autenticacao nao informado.' });
  }

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ erro: 'Formato de token invalido. Utilize: Bearer <token>' });
  }

  const token = partes[1];

  try {
    const dados = verificarToken(token);
    req.usuario = dados;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}

function autorizar(...tipos) {
  return (req, res, next) => {
    if (!req.usuario || !tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Voce nao tem permissao para acessar este recurso.' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };