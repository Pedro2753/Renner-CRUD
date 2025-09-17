import { carregarVariavel, salvarVariavel } from "./db.js";
import { abrirPopup, fecharPopup, load_dn } from "./ui.js";

let fotoBase64 = "./media/default.jpg"; // Variável global do módulo para armazenar a foto temporária

let popup = document.getElementById("p");
let canvas = document.querySelector("canvas");

// Manipulação do input de foto (registro)
export function initFotoInput(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  input.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        fotoBase64 = ev.target.result;
        preview.src = fotoBase64;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

export async function regextel() {
  const telefonef = document.getElementById("telefone");
  const alturaf = document.getElementById("altura");
  const pesof = document.getElementById("peso");

  telefonef.addEventListener("input", function (e) {
    let valor = e.target.value;
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, "");
    // Adiciona os parênteses e o hífen
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2"); // adiciona (XX)
    valor = valor.replace(/(\d{5})(\d{4})$/, "$1-$2"); // adiciona o hífen
    e.target.value = valor;
  });
}

export async function regexalt() {
  const alturaf = document.getElementById("altura");

  alturaf.addEventListener("input", function (e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d)(\d{2})$/, "$1.$2");
    e.target.value = valor;
  });
}

export async function regexpeso() {
  const pesof = document.getElementById("peso");

  pesof.addEventListener("input", function (e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d)(\d{2})$/, "$1.$2");
    e.target.value = valor;
  });
}

//pausa o script
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Registrar novo funcionário
export async function registrar() {
  let funcionarios = (await carregarVariavel("funcionarios")) || [];
  let index = (await carregarVariavel("index")) || 0;

  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  const partes = data.split("-");
  const dataformatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
  const genero =
    document.querySelector('input[name="genero"]:checked')?.value || "";
  const cpf = document.getElementById("cpf").value.trim();

  const cep = document.getElementById("cep").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();

  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("e-mail").value.trim();
  const cargo = document.getElementById("cargo").value.trim();
  const setor = document.getElementById("setor").value.trim();
  const turno = document.getElementById("turno").value.trim();
  const agencia =
    document.querySelector('input[name="agencia"]:checked')?.value || "";
  const altura = document.getElementById("altura").value.trim();
  const peso = document.getElementById("peso").value.trim();

  if (
    !nome ||
    !cpf ||
    !estado ||
    !genero ||
    !data ||
    isNaN(altura) ||
    isNaN(peso) ||
    !telefone ||
    !cargo ||
    !setor ||
    !email ||
    !agencia ||
    !turno
  ) {
    //alert("Preencha todo o formulário");
    abrirPopup();
    popup.innerHTML = `<p>Preencha todo o formulário</p>
    <button onclick='fecharPopup()'>Ok</button> `;
    return;
  }

  const funcionario = {
    id: index,
    nome,
    data: dataformatada,
    cpf,
    genero,
    endereco: {
      cep,
      bairro,
      cidade,
      estado,
    },
    telefone,
    email,
    cargo,
    setor,
    agencia,
    turno,
    altura,
    peso,
    foto: fotoBase64,
  };

  funcionarios.push(funcionario);
  index++;

  await salvarVariavel("funcionarios", funcionarios);
  await salvarVariavel("index", index);

  abrirPopup();
  canvas.style.display = "flex";
  popup.innerHTML = `<p>Usuario registrado com sucesso!</p>`;
  await esperar(1500);
  abrirPopup();
  canvas.style.display = "none";
  popup.innerHTML = `<p>Deseja exibir a lista?</p><button onclick="window.location.href='listar.html'">Ok</button>
<button onclick='fecharPopup()'>Fechar</button> `;
  limparCampos();
}

export async function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("e-mail").value = "";
  document.getElementById("cargo").value = "";
  document.getElementById("setor").value = "";
  document.getElementById("turno").value = "";
  document.getElementById("altura").value = "";
  document.getElementById("peso").value = "";
  preview.src = "";
}

export async function preencherFake() {
  document.getElementById("nome").value = "Miles Gonzalo Morales";

  let dataString = "03/08/1999"; // dd/mm/yyyy
  let partes = dataString.split("/");
  let dataHTML = `${partes[2]}-${partes[1].padStart(
    2,
    "0"
  )}-${partes[0].padStart(2, "0")}`;
  document.getElementById("data").value = dataHTML;

  document.querySelector('input[name="genero"]:checked')?.value || "";
  document.getElementById("cep").value = "01528-000";
  document.getElementById("bairro").value = "Brooklyn";
  document.getElementById("cidade").value = "Nova Iorque";
  document.getElementById("estado").value = "NI";
  document.getElementById("telefone").value = "(11) 95412-3475";
  document.getElementById("e-mail").value = "WebMorales@yahoo.com";
  document.getElementById("cargo").value = "Auxiliar de Logística";
  document.getElementById("setor").value = "Auditoria";
  document.getElementById("turno").value = "T1";
  document.querySelector('input[name="agencia"]:checked')?.value || "";
  document.getElementById("altura").value = "1.80";
  document.getElementById("peso").value = "75";

  fotoBase64 = "./media/miles.webp";
  preview.src = fotoBase64;
  preview.style.display = "block";
}

export async function buscarCEP(cep) {
  cep = cep.replace(/\D/g, ""); // só números

  if (cep.length !== 8) {
      abrirPopup();
      popup.innerHTML = `<p>CEP inválido! </p><button onclick='fecharPopup()'>OK</button> `;
    return;
  }

  try {
    let resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let dados = await resposta.json();

    if (dados.erro) {
      abrirPopup();
      popup.innerHTML = `<p>CEP não encontrado.</p><button onclick='fecharPopup()'>OK</button> `;
      return;
    }

    // Preenche os campos automaticamente

    document.getElementById("bairro").value = dados.bairro;
    document.getElementById("cidade").value = dados.localidade;
    document.getElementById("estado").value = dados.uf;
  } catch (error) {
    console.error(error);
  }
}

// Listar funcionários
export async function listarFunc() {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  let listaFunc = document.getElementById("listaFunc");

  listaFunc.innerHTML = "";
  if (funcionarios.length === 0) {
    listaFunc.innerHTML = "<p>Nenhum funcionário cadastrado.</p>";
    return;
  }

  funcionarios.forEach((f) => {
    let imgsrc =
      f.agencia === "Garra"
        ? "media/garra_banner.png"
        : f.agencia === "Latina"
        ? "media/latina_banner.png"
        : f.endereco.bairro === "Brooklyn"
        ? "media/spiderLogo.png"
        : "media/logo.png";
    let gensrc =
      f.endereco.bairro === "Brooklyn"
        ? "media/spiderIcon.png"
        : f.genero === "Masculino"
        ? "media/male.png"
        : f.genero === "Feminino"
        ? "media/female.png"
        : "";

    listaFunc.innerHTML += `
          <div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;">
        <div style='float: right; display:block; margin-top:-30px; line-height: 0; text-align: center'>
          <p><img src="${imgsrc}" width="80" style="border-radius:8px; border:1px solid #aaa;"></p>
          <p><img src="${f.foto}" width="80" height='200' style='object-fit: cover; 
          border-radius:100px;'></p>
          <p>${f.turno}
          <p>${f.setor}</p>
          <p>${f.cargo}</p>
        </div>
        <p>(ID: ${f.id}) <br>
        <b>Nome:</b> ${f.nome} - <img src="${gensrc}" style="width:16px"> <br> <b>CPF:</b> ${f.cpf} - <b>Data de nascimento:</b> ${f.data}
        <br>  <b>CEP:</b> ${f.endereco.cep} - <b>Bairro:</b> ${f.endereco.bairro} - <b>Cidade:</b> ${f.endereco.cidade} - <b>Estado:</b> ${f.endereco.estado} <br> 📞: ${f.telefone} -
        📧: ${f.email} <br>
        Altura: ${f.altura}cm - Peso: ${f.peso}Kg <br>
        <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  
        <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'></p>
      </div>`;
  });
}

export async function popupDeletar() {
  abrirPopup();
  canvas.style.display = "none";
  popup.innerHTML = `<p>Tem certeza?</p><button onclick="deletar'">Ok</button>
<button onclick='fecharPopup()'>Fechar</button> `;
}

export async function deletar(id) {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  const resposta = confirm("Você tem certeza que deseja deletar este item?");
  if (!resposta) return;

  const novalista = funcionarios.filter((f) => f.id !== id);
  await salvarVariavel("funcionarios", novalista);
  listarFunc();
  alert("Funcionário deletado com sucesso!");
}

// Funções para editar
export async function editar(id) {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  const func = funcionarios.find((f) => f.id === id);
  if (!func) return;

  fotoBase64 = func.foto;

  const html = `
    Nome: <input type="text" id="nomee" value="${func.nome}" disabled> <br>
    Data de nascimento: <input type="text" id="datae" value="${func.data}" disabled> <br>
    CPF: <input type="text" id="cpfe" value="${func.cpf}" disabled> <br>
    CEP: <input type="text" id="estadoe" value="${func.endereco.cep}"> <br>
    Bairro: <input type="text" id="estadoe" value="${func.endereco.bairro}"><br>
    Cidade: <input type="text" id="estadoe" value="${func.endereco.cidade}"><br>
    Estado: <input type="text" id="estadoe" value="${func.endereco.estado}" > <br>
    Telefone: <input type="text" id="telefonee" value="${func.telefone}"> <br>
    E-mail: <input type="text" id="emaile" value="${func.email}"> <br>
    Cargo: <input type="text" id="cargoe" value="${func.cargo}"> <br>
    Setor: <input type="text" id="setore" value="${func.setor}"> <br>
    Altura: <input type="text" id="alturae" value="${func.altura}"> <br>
    Peso: <input type="text" id="pesoe" value="${func.peso}"> <br>
    <label>Trocar foto: <input type="file" id="fotoEditar"></label>
    <br>
    <img id="previewEditar" src="${func.foto}" width="100" 
         style="border-radius:8px; border:1px solid #aaa; display:block; margin-bottom:10px;">
    <button class="btn" style="font-size: 16px" onclick="editarDados(${id})">Editar</button>
    <button class="btn" style="font-size: 16px" onclick="cancelarEditar()">Cancelar</button>`;

  document.getElementById("editar").innerHTML = html;

  // Atualizar foto ao editar
  initFotoInput("fotoEditar", "previewEditar");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function editarDados(id) {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  const resultado = funcionarios.find((f) => f.id === id);
  if (!resultado) return;

  resultado.telefone = document.getElementById("telefonee").value;
  resultado.email = document.getElementById("emaile").value;
  resultado.cargo = document.getElementById("cargoe").value;
  resultado.setor = document.getElementById("setore").value;
  resultado.altura = parseFloat(
    document.getElementById("alturae").value.replace(",", ".")
  );
  resultado.peso = parseFloat(
    document.getElementById("pesoe").value.replace(",", ".")
  );
  resultado.foto = fotoBase64;

  await salvarVariavel("funcionarios", funcionarios);
  listarFunc();
  document.getElementById("editar").innerHTML = "";

  abrirPopup();
  canvas.style.display = "flex";
  popup.innerHTML = `<p>Usuario registrado com sucesso!</p>`;
  await esperar(1700);
  fecharPopup();
  canvas.style.display = "none";

  setTimeout(load_dn, 500);
}

export function cancelarEditar() {
  document.getElementById("editar").innerHTML = "";
  listarFunc();
  setTimeout(load_dn, 500);
}

export function confirmarLimpar() {
  abrirPopup();
  popup.innerHTML = `<p>Você tem certeza que deseja deletar todos item?</p><button onclick="limparFuncionarios()">Sim</button>
<button onclick='fecharPopup()'>Fechar</button> `;
}

export async function limparFuncionarios() {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  let index = (await carregarVariavel("index")) || 0;
  if (funcionarios.length == 0) {
    abrirPopup();
    popup.innerHTML = `<p>Erro: Não há funcionarios cadastrados.</p>`;
    await esperar(1700);
    fecharPopup();
  } else {
    funcionarios.length = 0;
    funcionarios.splice(0, funcionarios.length);
    await salvarVariavel("funcionarios", funcionarios);
    await salvarVariavel("index", index);
    abrirPopup();
    canvas.style.display = "flex";
    popup.innerHTML = `<p>Todos os funcionarios foram deletados</p>`;
    await esperar(1700);
    fecharPopup();
    canvas.style.display = "none";
    listarFunc();
  }
}

export async function initPesquisa(campoId, listaId) {
  const campoPesquisa = document.getElementById(campoId);
  const listaFunc = document.getElementById(listaId);
  const funcionarios = (await carregarVariavel("funcionarios")) || [];

  function exibirResultados(resultados) {
    listaFunc.innerHTML = "";
    if (resultados.length > 0) {
      resultados.forEach((f) => {
        let imgsrc =
          f.agencia === "Garra"
            ? "media/garra_banner.png"
            : f.agencia === "Latina"
            ? "media/latina_banner.png"
            : "media/logo.png";
        let gensrc =
          f.endereco.bairro === "Brooklyn"
            ? "media/spiderIcon.png"
            : f.genero === "Masculino"
            ? "media/male.png"
            : f.genero === "Feminino"
            ? "media/female.png"
            : "";

        listaFunc.innerHTML += `
          <div id="func" style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:10px;">
        <div style='float: right; display:block; margin-top:-30px; line-height: 0; text-align: center;text-transform: uppercase;text-decoration: underline'>
          <p><img src="${imgsrc}" width="80" "></p>
          <p><img src="${f.foto}" width="80" height='200' style='object-fit: cover; 
          border-radius:100px;'></p>
            <p>${f.cargo}</p>
            <p>${f.setor}</p>
            <p>${f.turno}</p>
        </div>
        <p>ID: ${f.id} <br>
        <b>Nome:</b> ${f.nome} -  <img src="${gensrc}" style="width:16px"> <br> <b>CPF:</b> ${f.cpf} - <b>Data de nascimento:</b> ${f.data}
        <br>  <b>CEP:</b> ${f.endereco.cep} - <b>Bairro:</b> ${f.endereco.bairro} - <b>Cidade:</b> ${f.endereco.cidade} - <b>Estado:</b> ${f.endereco.estado} <br> 📞 ${f.telefone} -
        📧 ${f.email} <br>
        Altura: ${f.altura}cm - Peso: ${f.peso}Kg <br>
        <img src='media/edit.png' onclick='editar(${f.id})' id='icon'>  
        <img src='media/delete.png' onclick="deletar(${f.id})" id='icon'></p>
      </div>`;
      });
    } else {
      listaFunc.innerHTML = "Nenhum resultado encontrado.";
    }
  }

  // Evento de input para filtrar funcionários
  campoPesquisa.addEventListener("input", () => {
    const termoPesquisa = campoPesquisa.value.toLowerCase();
    const resultadosFiltrados = funcionarios.filter((f) =>
      f.nome.toLowerCase().includes(termoPesquisa)
    );
    exibirResultados(resultadosFiltrados);
  });

  // Exibe todos inicialmente
  exibirResultados(funcionarios);
}

// Supondo que você tenha carregarVariavel para buscar os funcionários
export async function gerarRelatorio() {
  const funcionarios = (await carregarVariavel("funcionarios")) || [];
  const relatorio = document.getElementById("relatorio");

  if (funcionarios.length === 0) {
    relatorio.innerHTML = "<p>Nenhum funcionário cadastrado.</p>";
    return;
  }

  // Montar relatório em HTML
  let html = "<h4><u>Lista de funcionários</u></h4>";
  funcionarios.forEach((f) => {
    html += `<div style="font-family:arial">
        <p><strong>ID:</strong> ${f.id}</p>
        <p><strong>Nome:</strong> ${f.nome}</p>
        <p><strong>CPF:</strong> ${f.cpf}</p>
        <p><strong>Data de Nascimento:</strong> ${f.data}</p>
        <p><strong>Telefone:</strong> ${f.telefone}</p>
        <p><strong>E-mail:</strong> ${f.email}</p>
        <p><strong>Cargo:</strong> ${f.cargo}</p>
        <p><strong>Setor:</strong> ${f.setor}</p>
        <p><strong>Agência:</strong> ${f.agencia}</p>
        <p><strong>Turno:</strong> ${f.turno}</p>
        <p><strong>Altura:</strong> ${f.altura} cm</p>
        <p><strong>Peso:</strong> ${f.peso} Kg</p>
        <p><strong>Endereço:</strong>${f.endereco?.bairro}, ${f.endereco?.cidade}/${f.endereco?.estado}, CEP: ${f.endereco?.cep}</p>
        <hr>
    
      </div>
    `;
  });

  relatorio.innerHTML = html;
}

export async function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4"); // retrato, pontos, A4

  // Captura o HTML do relatório
  const relatorio = document.getElementById("relatorio");

  // Adiciona ao PDF
  await pdf.html(relatorio, {
    callback: function (pdf) {
      pdf.save("relatorio_funcionarios.pdf"); // baixa o PDF
    },
    margin: [20, 20, 20, 20],
    autoPaging: "text",
    x: 10,
    y: 10,
  });
}
