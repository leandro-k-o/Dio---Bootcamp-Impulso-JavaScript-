let botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLButtonElement
let botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement
let soma = document.getElementById('soma') as HTMLInputElement
let campoSaldo = document.getElementById('campo-saldo') as HTMLSpanElement

campoSaldo.innerHTML = '0';

function somarAoSaldo(soma:number): void {
    if(campoSaldo!=null)
    campoSaldo.innerHTML = String(Number(campoSaldo.innerHTML)+soma);
}

function limparSaldo():void {
    if(campoSaldo!=null)
    campoSaldo.innerHTML = '';
}

if(botaoAtualizar!=null)
botaoAtualizar.addEventListener('click', function () {
    if(soma!=null){
        somarAoSaldo(Number(soma.value));
    }
    
});

if(botaoLimpar != null)
botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});