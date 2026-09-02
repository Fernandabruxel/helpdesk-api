const ChamadoModel = require('../models/chamadoModel');

const STATUS_PERMITIDOS = ['Aberto', 'Em Atendimento', 'Concluído'];

const chamadoController = {
  async criar(req, res, next) {
    try {
      const { titulo, descricao, prioridade } = req.body;
      const id = await ChamadoModel.criar({ titulo, descricao, prioridade, usuario_id: req.usuario.id });
      const chamado = await ChamadoModel.buscarPorId(id);
      res.status(201).json({ mensagem: 'Chamado criado com sucesso.', chamado });
    } catch (err) {
      next(err);
    }
  },

  async listar(req, res, next) {
    try {
      const { status } = req.query;
      const chamados = await ChamadoModel.listar({
        usuarioId: req.usuario.id,
        tipo: req.usuario.tipo,
        status
      });
      res.json(chamados);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente' && chamado.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem permissao para ver este chamado.' });
      }

      res.json(chamado);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente' && chamado.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem permissao para editar este chamado.' });
      }

      const tecnico_id = req.usuario.tipo === 'tecnico'
        ? (req.body.tecnico_id || chamado.tecnico_id || req.usuario.id)
        : chamado.tecnico_id;

      await ChamadoModel.atualizar(req.params.id, {
        titulo: req.body.titulo || chamado.titulo,
        descricao: req.body.descricao || chamado.descricao,
        prioridade: req.body.prioridade || chamado.prioridade,
        tecnico_id
      });

      const chamadoAtualizado = await ChamadoModel.buscarPorId(req.params.id);
      res.json({ mensagem: 'Chamado atualizado com sucesso.', chamado: chamadoAtualizado });
    } catch (err) {
      next(err);
    }
  },

  async alterarStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!STATUS_PERMITIDOS.includes(status)) {
        return res.status(400).json({ erro: 'Status invalido. Utilize: Aberto, Em Atendimento ou Concluído.' });
      }

      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente') {
        return res.status(403).json({ erro: 'Apenas tecnicos podem alterar o status de um chamado.' });
      }

      await ChamadoModel.atualizarStatus(req.params.id, status);
      const chamadoAtualizado = await ChamadoModel.buscarPorId(req.params.id);
      res.json({ mensagem: 'Status atualizado com sucesso.', chamado: chamadoAtualizado });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) return res.status(404).json({ erro: 'Chamado nao encontrado.' });

      if (req.usuario.tipo === 'cliente' && chamado.usuario_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem permissao para excluir este chamado.' });
      }

      await ChamadoModel.excluir(req.params.id);
      res.json({ mensagem: 'Chamado excluido com sucesso.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = chamadoController;