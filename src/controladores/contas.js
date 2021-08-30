const bd = require('../dados/bancodedados');

let numeroProximaConta = 1;

function consultarTodasAsContas(req, res) {
    res.send(bd.contas);
};

function criarConta(req, res) {
    if(bd.contas.find(c => c.usuario.cpf === req.body.cpf || c.usuario.email === req.body.email)){
        res.status(401);
        res.json({erro: "FALHA AO CRIAR CONTA: O CPF ou E-mail informado já esxiste em nosso banco de dados!"});
        return;
    } else {
        const novaConta = {
           numero: numeroProximaConta,
           saldo: 0,
           usuario: {
              nome: req.body.nome,
              cpf: req.body.cpf,
              data_nascimento: req.body.data_nascimento,
              telefone: req.body.telefone,
              email: req.body.email,
              senha: req.body.senha
           }
        }
     
        bd.contas.push(novaConta); 
        numeroProximaConta += 1; 
        res.send(novaConta);
    }
 };

module.exports = { 
    consultarTodasAsContas, 
    criarConta
};