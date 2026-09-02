const pool = require('../config/database');

const ComentarioModel = {
  async criar({ chamado_id, usuario_id, comentario }) {
    const [result] = await pool.execute(
      'INSERT INTO comentarios_chamado (chamado_id, usuario_id, comentario) VALUES (?, ?, ?)',
      [chamado_id, usuario_id, comentario]
    );
    return result.insertId;
  },

  async listarPorChamado(chamadoId) {
    const [rows] = await pool.execute(
      `SELECT cc.*, u.nome AS usuario_nome, u.tipo AS usuario_tipo
       FROM comentarios_chamado cc
       JOIN usuarios u ON u.id = cc.usuario_id
       WHERE cc.chamado_id = ? ORDER BY cc.created_at ASC`,
      [chamadoId]
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.execute('SELECT * FROM comentarios_chamado WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async excluir(id) {
    await pool.execute('DELETE FROM comentarios_chamado WHERE id = ?', [id]);
  }
};

module.exports = ComentarioModel;