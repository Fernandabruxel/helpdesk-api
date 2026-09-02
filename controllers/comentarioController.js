const ChamadoModel = require('../models/chamadoModel');
const ComentarioModel = require('../models/comentarioModel');

const comentarioController = {
  async listar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente' && chamado.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem permissao para ver estes comentarios.' });
      }

      const comentarios = await ComentarioModel.listarPorChamado(req.params.id);
      res.json(comentarios);
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente' && chamado.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem permissao para comentar neste chamado.' });
      }

      const id = await ComentarioModel.criar({
        chamado_id: req.params.id,
        usuario_id: req.usuario.id,
        comentario: req.body.comentario
      });

      const comentarios = await ComentarioModel.listarPorChamado(req.params.id);
      const criado = comentarios.find(c => c.id === id);
      res.status(201).json({ mensagem: 'Comentario adicionado com sucesso.', comentario: criado });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const comentario = await ComentarioModel.buscarPorId(req.params.id);
      if (!comentario) return res.status(404).json({ erro: 'Comentario nao encontrado.' });

      if (comentario.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce so pode excluir os seus proprios comentarios.' });
      }

      await ComentarioModel.excluir(req.params.id);
      res.json({ mensagem: 'Comentario excluido com sucesso.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = comentarioController;