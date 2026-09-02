function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
}

function tratarErro(err, req, res, next) {
  console.error(err);
  const mensagem = process.env.NODE_ENV === 'production'
    ? 'Ocorreu um erro interno no servidor.'
    : err.message;
  res.status(err.status || 500).json({ erro: mensagem });
}

module.exports = { naoEncontrado, tratarErro };