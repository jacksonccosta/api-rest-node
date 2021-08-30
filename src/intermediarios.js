const bd = require('./dados/bancodedados');

function valida_acesso(req, res, next) {
    if(req.method === 'GET' && req.originalUrl.split("?",1).toString() === '/contas') {
        if(req.query.senha_banco){
            if (req.query.senha_banco === bd.banco.senha) {
                next();
             }
             else {
                res.status(401);
                res.json({erro: "ACESSO NÃO AUTORIZADO: Senha incorreta!"});
                return;
             }
        }
        else {
            res.status(401);
            res.json({erro: "ACESSO NÃO AUTORIZADO: A senha não foi informada!"});
            return;
        }
    }
    else {
        next();
    }
};

module.exports = { valida_acesso };