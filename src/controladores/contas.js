const res = require('express/lib/response');
const bd = require('../dados/bancodedados');
const { msg400 } = require('../mensagens');

let numeroProximaConta = 1;

function consultarTodasAsContas(req, res) {
    res.status(200);
    res.send(bd.contas);
};

function criarConta(req, res) {
    if(bd.contas.find(c => c.usuario.cpf === req.body.cpf || c.usuario.email === req.body.email)){
        res.status(400);
        res.json({erro: msg400 });
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
        res.status(201);
        res.send(novaConta);
    }
 };

function atualizarUsuarioConta(req, res) {

    const conta = bd.contas.find(c => c.numero === Number(req.params.numeroConta));

    if (conta && (req.body.nome || 
                    (req.body.cpf && !bd.contas.find(c => c.usuario.cpf === req.body.cpf)) ||// VERIFICA SE JÁ EXISTE ALGUÉM COM O CPF INFORMADO
                    req.body.data_nascimento || 
                    req.body.telefone || 
                    (req.body.email && !bd.contas.find(c => c.usuario.email === req.body.email)) || // VERIFICA SE JÁ EXISTE ALGUÉM COM O E-MAIL INFORMADO
                    req.body.senha)) {
        conta.usuario.nome = req.body.nome ?? conta.usuario.nome;
        conta.usuario.cpf = req.body.cpf ?? conta.usuario.cpf;
        conta.usuario.data_nascimento = req.body.data_nascimento ?? conta.usuario.data_nascimento;
        conta.usuario.telefone = req.body.telefone ?? conta.usuario.telefone;
        conta.usuario.email = req.body.email ?? conta.usuario.email;
        conta.usuario.senha = req.body.senha ?? conta.usuario.senha;

        res.status(200);
        res.json({mensagem: "Conta atualizada com sucesso!"}); 
    } else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }
 };

 function excluirConta(req, res) {
    const conta = bd.contas.find((conta) => conta.numero === Number(req.params.numeroConta));
    if(conta){
        const indice = bd.contas.indexOf(conta);
        bd.contas.splice(indice, 1);
        res.json({mensagem: "Conta excluída com sucesso!" });
    }
    else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }
};

module.exports = { 
    consultarTodasAsContas, 
    criarConta,
    atualizarUsuarioConta,
    excluirConta
};