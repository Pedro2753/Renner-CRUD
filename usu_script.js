let usuarios = [];
let index_usu = 0;
let key = "";
let fotoBase64 = ""; // vai armazenar a foto convertida
let divfoto = document.getElementById("fd");
let menu = document.getElementById("menu")

const loader = document.getElementById("loader");

//Loading screen
function showLoader() {
  loader.style.display = "grid";
  document.documentElement.style.setProperty("cursor", "progress");
  setTimeout(() => {
    hideLoader();
  }, 1000);
}

function hideLoader() {
  loader.style.display = "none";
  document.documentElement.style.removeProperty("cursor");
}

function verificar_key() {
  key = JSON.parse(localStorage.getItem("key") || false);
  if (key == false) {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("reg_usu").style.display = "none";
    document.getElementById("ul_nav").style.display = "none";
    document.getElementById("menu").style.display = "none";
  } else if (key == true) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("reg_usu").style.display = "block";
    document.getElementById("ul_nav").style.display = "flex";
    document.getElementById("menu").style.display = "flex";
  }
}

function sair() {
  key = false;
  localStorage.setItem("key", JSON.stringify(key));
  verificar_key();
}

// Abre (ou cria) o banco
function abrirBanco() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("MeuBanco", 1);

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("variaveis")) {
        db.createObjectStore("variaveis", { keyPath: "nome" });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Erro ao abrir banco: " + event.target.errorCode);
    };
  });
}

//Limpar banco
async function limparStore(nomeStore) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction(nomeStore, "readwrite");
    let store = tx.objectStore(nomeStore);

    let req = store.clear();

    req.onsuccess = () => {
      console.log(`Store "${nomeStore}" limpa com sucesso!`);
      resolve(true);
    };
    req.onerror = (e) => reject(e);
  });
}

// Função genérica para salvar qualquer variável
async function salvarVariavel(nome, valor) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction("variaveis", "readwrite");
    let store = tx.objectStore("variaveis");

    store.put({ nome: nome, valor: valor });

    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e);
  });
}

// Função genérica para carregar qualquer variável
async function carregarVariavel(nome) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction("variaveis", "readonly");
    let store = tx.objectStore("variaveis");

    let req = store.get(nome);

    req.onsuccess = () => resolve(req.result ? req.result.valor : null);
    req.onerror = (e) => reject(e);
  });
}

document.getElementById("foto").addEventListener("change", function (e) {
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (ev) {
      fotoBase64 = ev.target.result;
      let img = document.getElementById("preview");
      img.src = fotoBase64;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

function registrar() {
  // --- CARREGAR ---
  carregarVariavel("usuarios").then((usuarios) => {
    carregarVariavel("index_usu").then((index_usu) => {
      if (!usuarios) usuarios = [];
      if (!index_usu) index_usu = 0;
      /* carregar jogadores salvos no localStorage
  let recupera = JSON.parse(localStorage.getItem("funcionarios") || "[]");
  let recuperai = parseInt(localStorage.getItem("index")  || "0");
  funcionarios = recupera;
  index = recuperai;
  */

      var nomef = document.getElementById("nome").value;
      var senhaf = document.getElementById("senha").value;
      var dataf = document.getElementById("data").value;
      // Se quiser formatar para dd/mm/yyyy:
      let partes = dataf.split("-");
      let dataformatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      let generof = document.querySelector(
        'input[name="genero"]:checked'
      ).value;
      var cpff = document.getElementById("cpf").value;
      var telefonef = document.getElementById("telefone").value;
      var emailf = document.getElementById("e-mail").value;

      let usuario = {
        id: index_usu,
        nome: nomef,
        senha: senhaf,
        data: dataformatada,
        cpf: cpff,
        genero: generof,
        telefone: telefonef,
        email: emailf,
        foto: fotoBase64,
      };
      index_usu++;

      if (
        nomef == "" ||
        senhaf == "" ||
        cpff == "" ||
        generof == "" ||
        dataformatada == "" ||
        telefonef == "" ||
        emailf == ""
      ) {
        alert("Preencha todo o formulario");
      } else {
        usuarios.push(usuario);

        alert("Usuário registrado com Sucesso!");

        /* Salvar no localstorage
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    localStorage.setItem("index", index);
    */

        // --- SALVAR ---
        salvarVariavel("usuarios", usuarios);
        salvarVariavel("index_usu", index_usu);

        location.reload();
      }
    });
  });
}

function listar() {
  /* carregar funcionarios salvos no localStorage
  let recupera = JSON.parse(localStorage.getItem("funcionarios") || "[]");
  let recuperai = parseInt(localStorage.getItem("index")  || "0");
  */

  carregarVariavel("usuarios").then((usuarios) => {
    carregarVariavel("index_usu").then((index_usu) => {
      if (!usuarios) usuarios = [];
      if (!index_usu) index_usu = [];

      // mostrar funcionarios já cadastrados
      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      if (usuarios.length === 0) {
        lista.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
        divfoto.style.display = "none";
      } else {
        divfoto.style.display = "block";
        usuarios.forEach((f) => {
          lista.innerHTML += `<div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;"> <div style='float: right; display:block; margin-top:-30px'><p><img src="${f.foto}" width="80"; height='200'; style=' object-fit: cover; border-radius:100px;'"></p></div>
    <p> <p></li> (ID: ${f.id}) - Nome: ${f.nome}, Senha: ${f.senha}, <br> CPF: ${f.cpf}, Data de nascimento: ${f.data},<br> Gênero: ${f.genero}, Telefone: ${f.telefone}, <br> E-mail: ${f.email}, <br> <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'> </p>`;
        });

        fd.style.display = "none";
      }
    });
  });
}

function editar(id) {
  carregarVariavel("usuarios").then((usuarios) => {
    let func = usuarios.find((obj) => obj.id === id);
    let html = ` Nome: <input type="text" id="nomee" value="${func.nome}" disabled> <br>
    Senha: <input type="text" id="senhae" value="${func.senha}"> <br>
  Data de nascimento: <input type="text" id="datae" value="${func.data}" disabled> <br>
   CPF: <input type="text" id="cpfe" value="${func.cpf}" disabled> <br>
  Telefone: <input type="text" id="telefonee" value="${func.telefone}"> <br>
  E-mail: <input type="text" id="emaile" value="${func.email}"> <br>
        <label>Trocar foto: <input type="file" id="fotoEditar"></label> 
        <img id="previewEditar" src="${func.foto}" width="100" 
         style="border-radius:8px; border:1px solid #aaa; display:block; margin-bottom:10px;">
      <button onclick="editarDados(${id})">Editar</button>
      <button onclick='cancelarEditar()'>Cancelar</button>
      <br><br>`;

    let diveditar = document.getElementById("editar");
    diveditar.innerHTML = html;

    fotoBase64 = func.foto;

    document
      .getElementById("fotoEditar")
      .addEventListener("change", function (e) {
        let file = e.target.files[0];
        if (file) {
          let reader = new FileReader();
          reader.onload = function (ev) {
            fotoBase64 = ev.target.result; // atualiza a nova foto
          };
          reader.readAsDataURL(file);
        }
      });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function editarDados(id) {
  carregarVariavel("usuarios").then((usuarios) => {
    let nomee = document.getElementById("nomee").value;
    let senhae = document.getElementById("senhae").value;
    let datae = document.getElementById("datae").value;
    let cpfe = document.getElementById("cpfe").value;
    let telefonee = document.getElementById("telefonee").value;
    let emaile = document.getElementById("emaile").value;

    let resultado = usuarios.find((obj) => obj.id === id);
    resultado.nome = nomee;
    resultado.senha = senhae;
    resultado.data = datae;
    resultado.cpf = cpfe;
    resultado.telefone = telefonee;
    resultado.email = emaile;
    resultado.foto = fotoBase64;

    // --- SALVAR ---
    salvarVariavel("usuarios", usuarios);
    listar();
    let diveditar = document.getElementById("editar");
    diveditar.innerHTML = "";
    alert("Usuário editado com sucesso!");
  });
}

function cancelarEditar() {
  listar();
  let diveditar = document.getElementById("editar");
  diveditar.innerHTML = "";
}

function deletar(id) {
  carregarVariavel("usuarios").then((usuarios) => {
    let resposta = confirm("Você tem certeza que deseja deletar este item?");
    if (resposta === true) {
      // O usuário clicou em "OK"
      let novalista = usuarios.filter((obj) => obj.id !== id);
      usuarios = novalista;
      // --- SALVAR ---
      salvarVariavel("usuarios", usuarios);
      listar();
      alert("Usuário deletado com sucesso!");
    }
  });
}

const campoPesquisa = document.getElementById("pesquisa");

carregarVariavel("usuarios").then((usuarios) => {
  function exibirResultados(resultados) {
    lista.innerHTML = "";
    if (resultados.length > 0) {
      resultados.forEach((f) => {
        lista.innerHTML += `<div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;"> <div style='float: right; display:block; margin-top:-30px'><p><img src="${f.foto}" width="80"; height='200'; style=' object-fit: cover; border-radius:100px;'"></p></div>
    <p> <p></li> (ID: ${f.id}) - Nome: ${f.nome}, <br> CPF: ${f.cpf}, Data de nascimento: ${f.data},<br> Telefone: ${f.telefone}, <br> E-mail: ${f.email}, <br> <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'> </p>`;
      });
    } else {
      lista.innerHTML = "<li>Nenhum resultado encontrado.</li>";
    }
  }

  campoPesquisa.addEventListener("input", () => {
    const termoPesquisa = campoPesquisa.value.toLowerCase();
    const resultadosFiltrados = usuarios.filter((usuario) =>
      usuario.nome.toLowerCase().includes(termoPesquisa)
    );

    exibirResultados(resultadosFiltrados);
  });

  // Chama a função inicialmente para exibir todos os funcionários
  exibirResultados(usuarios);
});

function dia_noite() {
  let mybody = document.getElementById("body");
  let mybodysave = "";
  if (mybody.style.background == "white") {
    mybody.style.background = "#1F1F1F";
    mybodysave = "#1F1F1F";
  } else {
    mybody.style.background = "white";
    mybodysave = "white";
  }

  localStorage.setItem("mybodysave", mybodysave);
}

function load_dn() {
  let mybody = document.getElementById("body");
  mybody.style.background = localStorage.getItem("mybodysave");
}

function limpar_banco() {
  carregarVariavel("usuarios").then((usuarios) => {
    if (usuarios.length === 0) {
      alert("Nenhum usuário cadastrado.");
    } else {
      let resposta = confirm(
        "Você tem certeza que deseja deletar todos os items?"
      );
      if (resposta === true) {
        limparStore("variaveis");
        listar();
      }
    }
  });
}

async function fazerLogin(event) {
  event.preventDefault(); // Evita recarregar a página

  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();
  const msg = document.getElementById("loginMensagem");

  // Carrega os usuários salvos no IndexedDB
  const usuarios = (await carregarVariavel("usuarios")) || [];

  // Verifica se existe um usuário com email e senha corretos
  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

  if (email == "admin@123" && senha == "admin") {
    msg.style.color = "green";
    msg.textContent = "Login realizado com sucesso!";
    key = true;
    localStorage.setItem("key", JSON.stringify(key));
    // Redirecionar ou esconder o login
    setTimeout(() => {
      document.getElementById("loginContainer").style.display = "none";
      // Aqui você pode mostrar a tela principal, chamar listar(), etc.
      verificar_key();
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginSenha").value = "";
      msg.textContent = "";
    }, 1000);
  } else {
    if (usuario) {
      msg.style.color = "green";
      msg.textContent = "Login realizado com sucesso!";
      key = true;
      localStorage.setItem("key", JSON.stringify(key));
      // Redirecionar ou esconder o login
      setTimeout(() => {
        document.getElementById("loginContainer").style.display = "none";
        // Aqui você pode mostrar a tela principal, chamar listar(), etc.
        verificar_key();
        document.getElementById("loginEmail").value = "";
        document.getElementById("loginSenha").value = "";
        msg.textContent = "";
      }, 1000);
    } else {
      msg.style.color = "red";
      msg.textContent = "E-mail ou senha incorretos!";
    }
  }
}
