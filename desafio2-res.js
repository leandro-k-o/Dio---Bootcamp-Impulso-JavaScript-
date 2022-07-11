var Profissao;
(function (Profissao) {
    Profissao[Profissao["atriz"] = 0] = "atriz";
    Profissao[Profissao["padeiro"] = 1] = "padeiro";
})(Profissao || (Profissao = {}));
var pessoa_1 = {
    nome: "maria",
    idade: 29,
    profissao: Profissao.atriz
};
var pessoa_2 = {
    nome: "roberto",
    idade: 19,
    profissao: Profissao.padeiro
};
var pessoa_3 = {
    nome: "laura",
    idade: 32,
    profissao: Profissao.atriz
};
var pessoa_4 = {
    nome: "carlos",
    idade: 19,
    profissao: Profissao.padeiro
};
