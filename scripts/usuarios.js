import { carregarVariavel, salvarVariavel } from "./db.js";



export async function regexFormUsu(){
    const telefone = document.getElementById("telefone");
    const campoSenha = document.getElementById("senha");
    const btnsenha = document.getElementById("btnSenha");


    telefone.addEventListener("input", function(e) {
    let valor = e.target.value;
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, "");
    // Adiciona os parênteses e o hífen
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");  // adiciona (XX) 
    valor = valor.replace(/(\d{5})(\d{4})$/, "$1-$2"); // adiciona o hífen
    e.target.value = valor;

  });

       btnsenha.addEventListener("click", () => {
    campoSenha.type = campoSenha.type === "password" ? "text" : "password";
    btnsenha.textContent = campoSenha.type === "password" ? "👁️" : "🙈";
  });
}

export async function registrarUsu() {
  // --- CARREGAR ---
  let usuarios = (await carregarVariavel("usuarios")) || [];
  let index_usu = (await carregarVariavel("index_usu")) || 0;
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
  let generof = document.querySelector('input[name="genero"]:checked').value;
  var telefonef = document.getElementById("telefone").value;
  var emailf = document.getElementById("e-mail").value;

  let usuario = {
    id: index_usu,
    nome: nomef,
    senha: senhaf,
    data: dataformatada,
    telefone: telefonef,
    email: emailf,
  };
  index_usu++;

  if (
    nomef == "" ||
    senhaf == "" ||
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
    await salvarVariavel("usuarios", usuarios);
    await salvarVariavel("index_usu", index_usu);

    location.reload();
  }
}

export async function listarUsu() {
  /* carregar dados salvos no localStorage
  let recupera = JSON.parse(localStorage.getItem("funcionarios") || "[]");
  let recuperai = parseInt(localStorage.getItem("index")  || "0");
  */

  const usuarios = (await carregarVariavel("usuarios")) || [];
  const divfoto = document.getElementById("fd");

  // mostrar usuarios já cadastrados
  let lista = document.getElementById("lista_usu");
  lista.innerHTML = "";

  if (usuarios.length === 0) {
    lista.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
    divfoto.style.display = "none";
  } else {
    divfoto.style.display = "block";
    usuarios.forEach((f) => {
      lista.innerHTML += `<p></li>ID: ${f.id} <br> NOME: ${f.nome} <br> SENHA: ${f.senha} <br> DATA DE NASCIMENTO: ${f.data}<br> TELEFONE: ${f.telefone} <br> E-MAIL: ${f.email} <br> <img src='media/edit.png' onclick='editarUsu(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletarUsu(${f.id})" id='icon'> </p>`;
    });

    fd.style.display = "none";
  }
}

export async function editarUsu(id) {
  let usuarios = (await carregarVariavel("usuarios")) || [];
  let func = usuarios.find((obj) => obj.id === id);
  if (!func) return;

  let html = ` Nome: <input type="text" id="nomee" value="${func.nome}" disabled> <br>
    Senha: <input type="text" id="senhae" value="${func.senha}"> <br>
  Data de nascimento: <input type="text" id="datae" value="${func.data}" disabled> <br>
   CPF: <input type="text" id="cpfe" value="${func.cpf}" disabled> <br>
  Telefone: <input type="text" id="telefonee" value="${func.telefone}"> <br>
  E-mail: <input type="text" id="emaile" value="${func.email}"> <br>
      <button onclick="editarDadosUsu(${id})">Editar</button>
      <button onclick='cancelarEditarUsu()'>Cancelar</button>
      <br><br>`;
;
  let diveditar = document.getElementById("editar");
  diveditar.innerHTML = html;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export async function editarDadosUsu(id) {
  let usuarios = (await carregarVariavel("usuarios")) || [];
  const resultado = usuarios.find((f) => f.id === id);
  if (!resultado) return;

  let nomee = document.getElementById("nomee").value;
  let senhae = document.getElementById("senhae").value;
  let datae = document.getElementById("datae").value;
  let cpfe = document.getElementById("cpfe").value;
  let telefonee = document.getElementById("telefonee").value;
  let emaile = document.getElementById("emaile").value;

  resultado.nome = nomee;
  resultado.senha = senhae;
  resultado.data = datae;
  resultado.cpf = cpfe;
  resultado.telefone = telefonee;
  resultado.email = emaile;


  // --- SALVAR ---
  salvarVariavel("usuarios", usuarios);
  listarUsu();
  let diveditar = document.getElementById("editar");
  diveditar.innerHTML = "";
  alert("Usuário editado com sucesso!");
}

export function cancelarEditarUsu() {
  listarUsu();
  let diveditar = document.getElementById("editar");
  diveditar.innerHTML = "";
}

export async function deletarUsu(id) {
  let usuarios = (await carregarVariavel("usuarios")) || [];
  let resposta = confirm("Você tem certeza que deseja deletar este item?");
  if (resposta === true) {
    // O usuário clicou em "OK"
    let novalista = usuarios.filter((obj) => obj.id !== id);
    usuarios = novalista;
    // --- SALVAR ---
    await salvarVariavel("usuarios", usuarios);
    listarUsu();
    alert("Usuário deletado com sucesso!");
  }
}

export async function limparUsuarios(){
  const usuarios = (await carregarVariavel("usuarios")) || [];
  let index_usu = (await carregarVariavel("index_usu")) || 0;
  if (usuarios.length == 0) {
    alert("Nenhum usuario cadastrado")
  } else {
  const resposta = confirm("Você tem certeza que deseja deletar todos os item?");
  if (!resposta) return;
  usuarios.length = 0;
  usuarios.splice(0, usuarios.length);
  await salvarVariavel("usuarios", usuarios);
  await salvarVariavel("index_usu", index_usu);
  alert("Todos os usuarios foram deletados.")
  listarUsu();
  }
}

export async function initPesquisaUsu(campoId, listaId) {
  const campoPesquisa = document.getElementById(campoId);
  const listaP = document.getElementById(listaId);
  const usuarios = (await carregarVariavel("usuarios")) || [];

  function exibirResultados(resultados) {
    listaP.innerHTML = "";
    if (resultados.length > 0) {
      resultados.forEach((f) => {
        listaP.innerHTML += `<p></li>ID: ${f.id} <br> NOME: ${f.nome} <br> SENHA: ${f.senha} <br> DATA DE NASCIMENTO: ${f.data}<br> TELEFONE: ${f.telefone} <br> E-MAIL: ${f.email} <br> <img src='media/edit.png' onclick='editarUsu(${f.id})' id='icon'>  </li> <img src='media/delete.png' onclick="deletarUsu(${f.id})" id='icon'> </p>`;
      });
    } else {
      listaP.innerHTML = "Nenhum resultado encontrado.";
    }
  }
  // Evento de input para filtrar funcionários
  campoPesquisa.addEventListener("input", () => {
    const termoPesquisa = campoPesquisa.value.toLowerCase();
    const resultadosFiltrados = usuarios.filter((f) =>
      f.nome.toLowerCase().includes(termoPesquisa)
    );
    exibirResultados(resultadosFiltrados);
  });

  // Exibe todos inicialmente
  exibirResultados(usuarios);
}
