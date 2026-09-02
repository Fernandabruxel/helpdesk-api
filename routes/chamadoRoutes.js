const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');
const comentarioController = require('../controllers/comentarioController');
const { autenticar } = require('../middlewares/authMiddleware');
const { validarChamado, validarStatus, validarComentario, verificarValidacao } = require('../middlewares/validationMiddleware');

/**
 * @openapi
 * /api/chamados:
 *   post:
 *     summary: Abre um novo chamado (cliente)
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descricao]
 *             properties:
 *               titulo: { type: string }
 *               descricao: { type: string }
 *               prioridade: { type: string, enum: [Baixa, Media, Alta] }
 *     responses:
 *       201: { description: Chamado criado }
 *   get:
 *     summary: Lista chamados (cliente ve os proprios, tecnico ve todos)
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Aberto, "Em Atendimento", "Concluído"] }
 *     responses:
 *       200: { description: Lista de chamados }
 */
router.post('/', autenticar, validarChamado, verificarValidacao, chamadoController.criar);
router.get('/', autenticar, chamadoController.listar);

/**
 * @openapi
 * /api/chamados/{id}:
 *   get:
 *     summary: Busca um chamado pelo id
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chamado encontrado }
 *       404: { description: Chamado nao encontrado }
 *   put:
 *     summary: Atualiza dados de um chamado
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chamado atualizado }
 *   delete:
 *     summary: Exclui um chamado
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chamado excluido }
 */
router.get('/:id', autenticar, chamadoController.buscarPorId);
router.put('/:id', autenticar, chamadoController.atualizar);
router.delete('/:id', autenticar, chamadoController.excluir);

/**
 * @openapi
 * /api/chamados/{id}/status:
 *   patch:
 *     summary: Altera o status de um chamado (tecnico)
 *     tags: [Chamados]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Aberto, "Em Atendimento", "Concluído"] }
 *     responses:
 *       200: { description: Status atualizado }
 *       403: { description: Apenas tecnicos podem alterar o status }
 */
router.patch('/:id/status', autenticar, validarStatus, verificarValidacao, chamadoController.alterarStatus);

/**
 * @openapi
 * /api/chamados/{id}/comentarios:
 *   get:
 *     summary: Lista os comentarios de um chamado
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista de comentarios }
 *   post:
 *     summary: Adiciona um comentario a um chamado
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comentario]
 *             properties:
 *               comentario: { type: string }
 *     responses:
 *       201: { description: Comentario criado }
 */
router.get('/:id/comentarios', autenticar, comentarioController.listar);
router.post('/:id/comentarios', autenticar, validarComentario, verificarValidacao, comentarioController.criar);

module.exports = router;