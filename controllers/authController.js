const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const { gerarToken } = require('../utils/jwt');

const authController = {
  async registrar(req, res, next) {
    try {
      const { nome, email, senha, tipo } = req.body;

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        return res.status(409).json({ erro: 'Ja existe um usuario com este email.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const id = await UsuarioModel.criar({ nome, email, senhaHash, tipo });

      res.status(201).json({ mensagem: 'Usuario criado com sucesso.', usuario: { id, nome, email, tipo } });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha invalidos.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Email ou senha invalidos.' });
      }

      const token = gerarToken(usuario);
      res.json({
        mensagem: 'Login realizado com sucesso.',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;