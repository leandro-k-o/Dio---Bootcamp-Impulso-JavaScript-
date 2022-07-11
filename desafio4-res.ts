//3fbed67373c51a1bddc4f6fad8abde09
var apiKey: string;
let requestToken: object;
let username: string;
let password: string;
let sessionId: string;
let listId: number|string = 8210024;

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button')as HTMLButtonElement;
let searchContainer = document.getElementById('search-container')as HTMLButtonElement;
let listContainer = document.getElementById('list-container') as HTMLDivElement;

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
  await pegarLista();
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

async function adicionarFilmeNaLista(filmeId:number, listaId:string|number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
  await pegarLista();
}

async function pegarLista() {
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  listContainer.innerHTML ='';
  let titulo = document.createElement('h3')
  titulo.textContent = 'Lista de filmes';
  listContainer.appendChild(titulo);
  let ul = document.createElement('ul');
  if(result.items){
    for(const item of result.items){
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title))
        ul.appendChild(li)
    }
  }
  listContainer.appendChild(ul)
}