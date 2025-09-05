let funcionarios = [];
let index = 0;
let key = "";
let fotoBase64 = ""; // vai armazenar a foto convertida
let divfoto = document.getElementById("fd");

const loader = document.getElementById("loader");

//Loading screen
function showLoader() {
  loader.hidden = false;
  document.documentElement.style.setProperty("cursor", "progress");
  setTimeout(() => {
    hideLoader();
  }, 1000);
}

function hideLoader() {
  loader.style.display = "none";
  document.documentElement.style.removeProperty("cursor");
}

// Verifica a chave de login
function verificar_key() {
key = JSON.parse(localStorage.getItem("key") || false);
  if (key == false) {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("reg_usu").style.display = "none";
    document.getElementById("ul_nav").style.display = "none";
  } else if (key == true) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("reg_usu").style.display = "block";
    document.getElementById("ul_nav").style.display = "flex";
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
  carregarVariavel("funcionarios").then((funcionarios) => {
    carregarVariavel("index").then((index) => {
      if (!funcionarios) funcionarios = [];
      if (!index) index = 0;
      /* carregar jogadores salvos no localStorage
  let recupera = JSON.parse(localStorage.getItem("funcionarios") || "[]");
  let recuperai = parseInt(localStorage.getItem("index")  || "0");
  funcionarios = recupera;
  index = recuperai;
  */

      var nomef = document.getElementById("nome").value;
      var dataf = document.getElementById("data").value;
      // Se quiser formatar para dd/mm/yyyy:
      let partes = dataf.split("-");
      let dataformatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      let generof = document.querySelector(
        'input[name="genero"]:checked'
      ).value;
      var cpff = document.getElementById("cpf").value;
      var estadof = document.getElementById("estado").value;
      var telefonef = document.getElementById("telefone").value;
      var emailf = document.getElementById("e-mail").value;
      var cargof = document.getElementById("cargo").value;
      var setorf = document.getElementById("setor").value;
      var turnof = document.getElementById("turno").value;
      var agenciaf = document.querySelector(
        'input[name="agencia"]:checked'
      ).value;
      var alt = document.getElementById("altura").value;
      var alturaf = parseFloat(alt.replace(",", "."));
      var pes = document.getElementById("peso").value;
      var pesof = parseFloat(pes.replace(",", "."));

      let funcionario = {
        id: index,
        nome: nomef,
        data: dataformatada,
        cpf: cpff,
        genero: generof,
        estado: estadof,
        telefone: telefonef,
        email: emailf,
        cargo: cargof,
        setor: setorf,
        agencia: agenciaf,
        turno: turnof,
        altura: alturaf,
        peso: pesof,
        foto: fotoBase64,
      };
      index++;

      if (
        nomef == "" ||
        cpff == "" ||
        estadof == "" ||
        generof == "" ||
        dataformatada == "" ||
        pesof == "" ||
        estadof == "" ||
        alturaf == "" ||
        telefonef == "" ||
        cargof == "" ||
        setorf == "" ||
        pesof == "" ||
        emailf == "" ||
        agenciaf == "" ||
        turnof == ""
      ) {
        alert("Preencha todo o formulario");
      } else {
        funcionarios.push(funcionario);

        alert("Funcionario registrado com Sucesso!");

        /* Salvar no localstorage
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    localStorage.setItem("index", index);
    */

        // --- SALVAR ---
        salvarVariavel("funcionarios", funcionarios);
        salvarVariavel("index", index);

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

  carregarVariavel("funcionarios").then((funcionarios) => {
    carregarVariavel("index").then((index) => {
      if (!funcionarios) funcionarios = [];
      if (!index) index = 0;

      // mostrar funcionarios já cadastrados
      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      let imgsrc = "media/logo.png";

      if (funcionarios.length === 0) {
        lista.innerHTML = "<p>Nenhum funcionário cadastrado.</p>";
        divfoto.style.display = "none";
      } else {
        divfoto.style.display = "block";
        funcionarios.forEach((f) => {
          if (f.agencia == "Garra") {
            imgsrc = "media/garra_banner.png";
          } else if (f.agencia == "Latina") {
            imgsrc = "media/latina_banner.png";
          }
          lista.innerHTML += `<div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;"> <div style='float: right; display:block; margin-top:-30px'> <p><img src="${imgsrc}" width="80"; ; border-radius:8px; border:1px solid #aaa;"</p><p><img src="${f.foto}" width="80"; height='200'; style=' object-fit: cover; border-radius:100px;'"></p></div>
    <p> <p></li> (ID: ${f.id}) - Nome: ${f.nome}, <br> CPF: ${f.cpf}, Data de nascimento: ${f.data},<br> Gênero: ${f.genero}, Estado: ${f.estado}, Telefone: ${f.telefone}, <br> E-mail: ${f.email}, <br> Cargo: ${f.cargo},  Setor: ${f.setor},<br> Agência: ${f.agencia}, Turno: ${f.turno} <br> Altura: ${f.altura}cm, Peso: ${f.peso}Kg <br> <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'> </p>`;
        });

        fd.style.display = "none";
      }
    });
  });
}

function editar(id) {
  carregarVariavel("funcionarios").then((funcionarios) => {
    let func = funcionarios.find((obj) => obj.id === id);
    let html = ` Nome: <input type="text" id="nomee" value="${func.nome}" disabled> <br>
  Data de nascimento: <input type="text" id="datae" value="${func.data}" disabled> <br>
   CPF: <input type="text" id="cpfe" value="${func.cpf}" disabled> <br>
   Estado: <input type="text" id="estadoe" value="${func.estado}" disabled> <br>
  Telefone: <input type="text" id="telefonee" value="${func.telefone}"> <br>
  E-mail: <input type="text" id="emaile" value="${func.email}"> <br>
    Cargo: <input type="text" id="cargoe" value="${func.cargo}"> <br>
      Setor: <input type="text" id="setore" value="${func.setor}"> <br>
        Altura: <input type="text" id="alturae" value="${func.altura}"> <br>
        Peso: <input type="text" id="pesoe" value="${func.peso}"> <br>
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
  carregarVariavel("funcionarios").then((funcionarios) => {
    let nomee = document.getElementById("nomee").value;
    let datae = document.getElementById("datae").value;
    let cpfe = document.getElementById("cpfe").value;
    let estadoe = document.getElementById("estadoe").value;
    let telefonee = document.getElementById("telefonee").value;
    let emaile = document.getElementById("emaile").value;
    let cargoe = document.getElementById("cargoe").value;
    let setore = document.getElementById("setore").value;
    let alturae = document.getElementById("alturae").value;
    let pesoe = document.getElementById("pesoe").value;

    let resultado = funcionarios.find((obj) => obj.id === id);
    resultado.nome = nomee;
    resultado.data = datae;
    resultado.cpf = cpfe;
    resultado.estado = estadoe;
    resultado.telefone = telefonee;
    resultado.email = emaile;
    resultado.cargo = cargoe;
    resultado.setor = setore;
    resultado.altura = alturae;
    resultado.peso = pesoe;
    resultado.foto = fotoBase64;
    // --- SALVAR ---
    salvarVariavel("funcionarios", funcionarios);
    listar();
    let diveditar = document.getElementById("editar");
    diveditar.innerHTML = "";
    alert("Funcionario editado com sucesso!");
  });
}

function cancelarEditar() {
  listar();
  let diveditar = document.getElementById("editar");
  diveditar.innerHTML = "";
}

function deletar(id) {
  carregarVariavel("funcionarios").then((funcionarios) => {
    let resposta = confirm("Você tem certeza que deseja deletar este item?");
    if (resposta === true) {
      // O usuário clicou em "OK"
      let novalista = funcionarios.filter((obj) => obj.id !== id);
      funcionarios = novalista;
      // --- SALVAR ---
      salvarVariavel("funcionarios", funcionarios);
      listar();
      alert("Funcionario deletado com sucesso!");
    }
  });
}

const campoPesquisa = document.getElementById("pesquisa");

carregarVariavel("funcionarios").then((funcionarios) => {
  function exibirResultados(resultados) {
    lista.innerHTML = "";
    if (resultados.length > 0) {
      resultados.forEach((f) => {
        if (f.agencia == "Garra") {
          imgsrc = "media/garra_banner.png";
        } else if (f.agencia == "Latina") {
          imgsrc = "media/latina_banner.png";
        }
        lista.innerHTML += `<div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;"> <div style='float: right; display:block; margin-top:-30px'> <p><img src="${imgsrc}" width="80"; ; border-radius:8px; border:1px solid #aaa;"</p><p><img src="${f.foto}" width="80"; height='200'; style=' object-fit: cover; border-radius:100px;'"></p></div>
    <p> <p></li> (ID: ${f.id}) - Nome: ${f.nome}, <br> CPF: ${f.cpf}, Data de nascimento: ${f.data},<br> Estado: ${f.estado}, Telefone: ${f.telefone}, <br> E-mail: ${f.email}, <br> Cargo: ${f.cargo},  Setor: ${f.setor},<br> Agência: ${f.agencia}, Turno: ${f.turno} <br> Altura: ${f.altura}cm, Peso: ${f.peso}Kg <br> <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'> </p>`;
      });
    } else {
      lista.innerHTML = "<li>Nenhum resultado encontrado.</li>";
    }
  }

  campoPesquisa.addEventListener("input", () => {
    const termoPesquisa = campoPesquisa.value.toLowerCase();
    const resultadosFiltrados = funcionarios.filter((funcionario) =>
      funcionario.nome.toLowerCase().includes(termoPesquisa)
    );

    exibirResultados(resultadosFiltrados);
  });

  // Chama a função inicialmente para exibir todos os funcionários
  exibirResultados(funcionarios);
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
  carregarVariavel("funcionarios").then((funcionarios) => {
    if (funcionarios.length === 0) {
      alert("Nenhum funcionário cadastrado.");
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
