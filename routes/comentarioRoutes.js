const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/comentarios/{id}:
 *   delete:
 *     summary: Exclui um comentario (apenas o autor)
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Comentario excluido }
 *       403: { description: Sem permissao }
 */
router.delete('/:id', autenticar, comentarioController.excluir);

module.exports = router;