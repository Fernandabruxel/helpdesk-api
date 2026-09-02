const UsuarioModel = require('../models/usuarioModel');

const usuarioController = {
  async listar(req, res, next) {
    try {
      const usuarios = await UsuarioModel.listarTodos();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ erro: 'Usuario nao encontrado.' });
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      if (Number(req.params.id) !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce so pode atualizar o seu proprio usuario.' });
      }
      const { nome, email } = req.body;
      await UsuarioModel.atualizar(req.params.id, { nome, email });
      const usuario = await UsuarioModel.buscarPorId(req.params.id);
      res.json({ mensagem: 'Usuario atualizado com sucesso.', usuario });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = usuarioController;