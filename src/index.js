const app = require('./servidor');
const roteador = require('./roteador');
const { valida_acesso } = require('./intermediarios');

app.use(valida_acesso);
app.use(roteador);

app.listen(3000);