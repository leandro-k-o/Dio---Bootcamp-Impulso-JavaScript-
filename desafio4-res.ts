//3fbed67373c51a1bddc4f6fad8abde09
var apiKey: string;
let requestToken: object;
let username: string;
let password: string;
let sessionId: string;
let listId: number;// = 8210024;

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button')as HTMLButtonElement;
let createListButton = document.getElementById('criarLista') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container')as HTMLButtonElement;
let currentList = document.getElementById('currentList') as HTMLDivElement;
let createdList = document.getElementById('createdList') as HTMLDivElement;

interface Get{
    url: string,
    method: 'GET'|'POST',
    body?: any,
  }

interface Result{
    page:number,
    results: {},
    total_pages: number
}

loginButton?.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
  await listarLista();
})

searchButton?.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let queryElement = document.getElementById('search') as HTMLInputElement
  let query = queryElement?.value;
  let listaDeFilmes:any = await procurarFilme(query);
  let ul = document.createElement('ul') as HTMLUListElement;
  ul.id = "lista";
  ul.style.listStyle = "none";
  if(listaDeFilmes.results){
    for (const item of listaDeFilmes.results) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.id = item.id;
        span.textContent = 'Adicionar a lista';
        span.style.display = 'none';
        span.style.fontSize = '.7rem';
        span.style.marginLeft = '10px';
        span.style.cursor = 'pointer';
        span.addEventListener('click',()=>{
            adicionarFilmeNaLista(item.id,listId)
        })

        li.appendChild(document.createTextNode(item.original_title))
        li.appendChild(span);
        
        li.addEventListener('mouseover',()=>{
            let spanBtn = document.getElementById(item.id)
            if(spanBtn)
            spanBtn.style.display = 'inline-block';
        })
        li.addEventListener('mouseout',()=>{
            let spanBtn = document.getElementById(item.id)
            if(spanBtn)
            spanBtn.style.display = 'none';
        })
       
        ul.appendChild(li)
      }
  }
  console.log(listaDeFilmes);
  searchContainer?.appendChild(ul);
})

createListButton?.addEventListener('click', async () => {
  let nomeDaListaEl = document.getElementById("nameList") as HTMLInputElement;
  let descricaoEl = document.getElementById("description") as HTMLInputElement;
  if(nomeDaListaEl && descricaoEl){
    let nomeDaLista = nomeDaListaEl.value;
    let descricao = descricaoEl.value;
    if(nomeDaLista && descricao){
      await criarLista(nomeDaLista,descricao);
      await listarLista();
      nomeDaListaEl.value = '';
      descricaoEl.value = '';
    }
  }
})

function preencherSenha():void {
  let passElement = document.getElementById('senha') as HTMLInputElement;
  password = passElement?.value
  validateLoginButton();
}

function preencherLogin():void {
  let user =  document.getElementById('login') as HTMLInputElement
  username = user?.value;
  validateLoginButton();
}

function preencherApi(): void{
  let apikeyElement = document.getElementById('api-key') as HTMLInputElement
  apiKey = apikeyElement?.value;
  validateLoginButton();
}

function validateLoginButton(): void {
    if(loginButton != null){    
        if (password && username && apiKey) {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }
}


class HttpClient {
  
  static async get(data:Get) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(data.method, data.url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
          loginSuccess();
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (data.body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        data.body = JSON.stringify(data.body);
      }
      request.send(data.body);
    })
  }
}

async function procurarFilme(query:string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

async function adicionarFilme(filmeId:string|number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}
// FUNÇÕES DE LOGIN
async function criarRequestToken () {
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  })
  if(result.request_token)
    requestToken = result.request_token
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  })
  if(result.session_id)
    sessionId = result.session_id;
}

function loginSuccess(){
    let passElement = document.getElementById('senha') as HTMLInputElement;
    passElement.value = ''
    let user =  document.getElementById('login') as HTMLInputElement
    user.value = '';
    let apikeyElement = document.getElementById('api-key') as HTMLInputElement
    apikeyElement.value = '';

}

// FIM DE FUNÇÕES DE LOGIN

async function criarLista(nomeDaLista:string, descricao:string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId:number, listaId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
  await pegarLista(listaId);
}

async function pegarLista(lista_Id:number) {
  listId = lista_Id;
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  currentList.innerHTML ='';
  let titulo = document.createElement('h3')
  titulo.textContent = 'Lista de filmes';
  currentList.appendChild(titulo);
  let ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  if(result.items){
    for(const item of result.items){
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title))
        ul.appendChild(li)
    }
  }
  currentList.appendChild(ul)
}

async function listarLista() {
  let accountId: any = await getAccountId()
  if(accountId)
    accountId = accountId.id
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/account/${accountId}/lists?api_key=${apiKey}&session_id=${sessionId}`,
    method: "GET"
  })
  createdList.innerHTML ='';
  let titulo = document.createElement('h3')
  titulo.textContent = 'Suas listas de filmes';
  createdList.appendChild(titulo);
  let ul = document.createElement('ul');
  ul.style.listStyle = "none";
  if(result.results){
    for(const item of result.results){
        let li = document.createElement('li');
        li.id=item.id;
        li.appendChild(document.createTextNode(item.name))
        li.addEventListener('click',()=>{
          pegarLista(item.id);
        })
        li.addEventListener('mouseover',()=>{
          li.style.cursor = "pointer";
        })
        ul.appendChild(li)
    }
  }
  createdList.appendChild(ul)
}

async function getAccountId(){
  return await HttpClient.get({
    url:`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
    method: 'GET',
  })
}