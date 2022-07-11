"use strict";
let botaoAtualizar = document.getElementById('atualizar-saldo');
let botaoLimpar = document.getElementById('limpar-saldo');
let soma = document.getElementById('soma');
let campoSaldo = document.getElementById('campo-saldo');
campoSaldo.innerHTML = '0';
function somarAoSaldo(soma) {
    if (campoSaldo != null)
        campoSaldo.innerHTML = String(Number(campoSaldo.innerHTML) + soma);
}
function limparSaldo() {
    if (campoSaldo != null)
        campoSaldo.innerHTML = '';
}
if (botaoAtualizar != null)
    botaoAtualizar.addEventListener('click', function () {
        if (soma != null) {
            somarAoSaldo(Number(soma.value));
        }
    });
if (botaoLimpar != null)
    botaoLimpar.addEventListener('click', function () {
        limparSaldo();
    });
