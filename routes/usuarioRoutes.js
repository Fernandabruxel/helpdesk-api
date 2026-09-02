const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuarios
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuarios }
 *       401: { description: Nao autenticado }
 */
router.get('/', autenticar, usuarioController.listar);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca um usuario pelo id
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario encontrado }
 *       404: { description: Usuario nao encontrado }
 *   put:
 *     summary: Atualiza um usuario (apenas o proprio usuario)
 *     tags: [Usuarios]
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
 *             properties:
 *               nome: { type: string }
 *               email: { type: string }
 *     responses:
 *       200: { description: Usuario atualizado }
 *       403: { description: Sem permissao }
 */
router.get('/:id', autenticar, usuarioController.buscarPorId);
router.put('/:id', autenticar, usuarioController.atualizar);

module.exports = router;