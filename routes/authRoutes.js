const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarRegistro, validarLogin, verificarValidacao } = require('../middlewares/validationMiddleware');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuario (cliente ou tecnico)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha, tipo]
 *             properties:
 *               nome: { type: string }
 *               email: { type: string }
 *               senha: { type: string }
 *               tipo: { type: string, enum: [cliente, tecnico] }
 *     responses:
 *       201: { description: Usuario criado com sucesso }
 *       409: { description: Email ja cadastrado }
 */
router.post('/register', validarRegistro, verificarValidacao, authController.registrar);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuario e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       200: { description: Login realizado com sucesso }
 *       401: { description: Email ou senha invalidos }
 */
router.post('/login', validarLogin, verificarValidacao, authController.login);

module.exports = router;