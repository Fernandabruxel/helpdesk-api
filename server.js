require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`HelpDesk API rodando na porta ${PORT}`);
  console.log(`Documentacao Swagger: http://localhost:${PORT}/api-docs`);
});