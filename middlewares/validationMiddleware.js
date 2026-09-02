const { body, validationResult } = require('express-validator');

const validarRegistro = [
  body('nome').trim().notEmpty().withMessage('Nome e obrigatorio').escape(),
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no minimo 6 caracteres'),
  body('tipo').isIn(['cliente', 'tecnico']).withMessage('Tipo de usuario invalido')
];

const validarLogin = [
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha obrigatoria')
];

const validarChamado = [
  body('titulo').trim().notEmpty().withMessage('Titulo e obrigatorio').escape(),
  body('descricao').trim().notEmpty().withMessage('Descricao e obrigatoria').escape(),
  body('prioridade').optional().isIn(['Baixa', 'Media', 'Alta']).withMessage('Prioridade invalida')
];

const validarStatus = [
  body('status').isIn(['Aberto', 'Em Atendimento', 'Concluído']).withMessage('Status invalido')
];

const validarComentario = [
  body('comentario').trim().notEmpty().withMessage('Comentario nao pode ser vazio').escape()
];

function verificarValidacao(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erro: erros.array()[0].msg, detalhes: erros.array() });
  }
  next();
}

module.exports = {
  validarRegistro, validarLogin, validarChamado, validarStatus, validarComentario, verificarValidacao
};