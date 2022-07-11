// Como podemos rodar isso em um arquivo .ts sem causar erros? 

// INTERFACE

interface Employee{
    code:number,
    name:string,
}

let employee: Employee = {
    code: 10,
    name: "John",
}

// OUTRA  OPÇÃO

// let employee:(code:number, name:string) => {
//     code: 10,
//     name: "John"
// }