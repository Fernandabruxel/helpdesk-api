const pool = require('../config/database');

const ChamadoModel = {
  async criar({ titulo, descricao, prioridade, usuario_id }) {
    const [result] = await pool.execute(
      `INSERT INTO chamados (titulo, descricao, status, prioridade, usuario_id)
       VALUES (?, ?, 'Aberto', ?, ?)`,
      [titulo, descricao, prioridade || 'Media', usuario_id]
    );
    return result.insertId;
  },

  async listar({ usuarioId, tipo, status }) {
    let sql = `SELECT c.*, uc.nome AS cliente_nome, ut.nome AS tecnico_nome
               FROM chamados c
               JOIN usuarios uc ON uc.id = c.usuario_id
               LEFT JOIN usuarios ut ON ut.id = c.tecnico_id
               WHERE 1 = 1`;
    const params = [];

    if (tipo === 'cliente') {
      sql += ' AND c.usuario_id = ?';
      params.push(usuarioId);
    }
    if (status) {
      sql += ' AND c.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, uc.nome AS cliente_nome, uc.email AS cliente_email, ut.nome AS tecnico_nome
       FROM chamados c
       JOIN usuarios uc ON uc.id = c.usuario_id
       LEFT JOIN usuarios ut ON ut.id = c.tecnico_id
       WHERE c.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async atualizar(id, { titulo, descricao, prioridade, tecnico_id }) {
    await pool.execute(
      `UPDATE chamados SET titulo = ?, descricao = ?, prioridade = ?, tecnico_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [titulo, descricao, prioridade, tecnico_id || null, id]
    );
  },

  async atualizarStatus(id, status) {
    const encerradoEm = status === 'Concluído' ? 'NOW()' : 'NULL';
    await pool.execute(
      `UPDATE chamados SET status = ?, updated_at = NOW(), encerrado_em = ${encerradoEm} WHERE id = ?`,
      [status, id]
    );
  },

  async excluir(id) {
    await pool.execute('DELETE FROM chamados WHERE id = ?', [id]);
  }
};

module.exports = ChamadoModel;