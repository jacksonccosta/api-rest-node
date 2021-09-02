const bd = require('../dados/bancodedados');
const { format } = require('date-fns');
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

    const conta = bd.contas.find((conta) => conta.numero === Number(req.params.numeroConta));

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
    if(conta && conta.saldo === 0){
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

function depositar(req, res) {
    const conta = bd.contas.find((conta) => conta.numero === Number(req.body.numero));

    if (req.body.numero && req.body.valor && conta && Number(req.body.valor) > 0) {
        const deposito = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            numero_conta: req.body.numero,
            valor: req.body.valor
        }
        conta.saldo += Number(deposito.valor);
        bd.depositos.push(deposito);
        res.status(200);
        res.json({mensagem: "Depósito realizado com sucesso!" });
    }
    else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }
};

function sacar(req, res) {
    const conta = bd.contas.find((conta) => conta.numero === Number(req.body.numero));

    if (conta && 
        req.body.senha &&
        req.body.numero && 
        req.body.valor && 
        conta.usuario.senha === req.body.senha && 
        req.body.valor <= conta.saldo) 
    {
        const saque = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            numero_conta: req.body.numero,
            valor: req.body.valor
        }
        conta.saldo -= Number(saque.valor);
        bd.saques.push(saque);
        res.status(200);
        res.json({mensagem: "Saque realizado com sucesso!" });
    }
    else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }    
};

function transferir(req, res) {
    const conta_origem = bd.contas.find((conta_origem) => conta_origem.numero === Number(req.body.numero_conta_origem));
    const conta_destino = bd.contas.find((conta_destino) => conta_destino.numero === Number(req.body.numero_conta_destino));

    if (conta_origem &&
        conta_destino &&
        req.body.numero_conta_origem &&
        req.body.numero_conta_origem !== req.body.numero_conta_destino &&
        req.body.senha_conta_origem && 
        req.body.valor && 
        req.body.numero_conta_destino && 
        conta_origem.usuario.senha === req.body.senha_conta_origem &&
        req.body.valor <= conta_origem.saldo) 
    {
        const transferencia = {
            data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            numero_conta_origem: req.body.numero_conta_origem,
            numero_conta_destino: req.body.numero_conta_destino,
            valor: req.body.valor
        }

        conta_origem.saldo -= Number(transferencia.valor);
        conta_destino.saldo += Number(transferencia.valor);

        bd.transferencias.push(transferencia);
        res.status(200);
        res.json({mensagem: "Transferência realizada com sucesso!" });
    }
    else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }    
};

function saldo(req, res) {
    const conta = bd.contas.find((conta) => conta.numero === Number(req.query.numero_conta));

    console.log(conta);
    console.log(req.query.numero_conta);
    console.log(req.query.senha);

    if (conta && req.query.numero_conta && req.query.senha) {
        res.status(200);
        res.json({saldo: conta.saldo});
    }else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }
};

function extrato(req, res) {
    const conta = bd.contas.find((conta) => conta.numero === Number(req.query.numero_conta));

    if (conta && req.query.numero_conta && req.query.senha) {
        const extrato = {
            saques: bd.saques.find((saques) => saques.numero_conta === req.query.numero_conta),
            depositos: bd.depositos.find((depositos) => depositos.numero_conta === req.query.numero_conta),
            transferenciasEnviadas: bd.transferencias.find((transferenciasEnviadas) => transferenciasEnviadas.numero_conta_origem === req.query.numero_conta),
            transferenciasRecebidas: bd.transferencias.find((transferenciasRecebidas) => transferenciasRecebidas.numero_conta_destino === req.query.numero_conta)
        }
        res.status(200);
        res.json(extrato);
    }else {
        res.status(400);
        res.json({erro: msg400 });
        return;
    }
};


module.exports = { 
    consultarTodasAsContas, 
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};