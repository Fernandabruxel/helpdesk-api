const pool = require('../config/database');

const UsuarioModel = {
  async criar({ nome, email, senhaHash, tipo }) {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo]
    );
    return result.insertId;
  },

  async buscarPorEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async buscarPorId(id) {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, tipo, created_at FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async listarTodos() {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, tipo, created_at FROM usuarios ORDER BY nome ASC'
    );
    return rows;
  },

  async atualizar(id, { nome, email }) {
    await pool.execute('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
  }
};

module.exports = UsuarioModel;