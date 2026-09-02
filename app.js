require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./docs/swagger');
const corsMiddleware = require('./middlewares/corsMiddleware');
const { naoEncontrado, tratarErro } = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ mensagem: 'HelpDesk API no ar. Veja a documentacao em /api-docs' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use('/api/comentarios', comentarioRoutes);

app.use(naoEncontrado);
app.use(tratarErro);

module.exports = app;