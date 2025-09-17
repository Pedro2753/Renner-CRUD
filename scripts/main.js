import { listarFunc, registrar, deletar, editar, editarDados, cancelarEditar, initFotoInput, initPesquisa, regexpeso, regextel, regexalt, limparFuncionarios, buscarCEP, preencherFake,gerarRelatorio,gerarPDF, limparCampos, confirmarLimpar} from "./funcionarios.js";
import { listarUsu, registrarUsu, deletarUsu, editarUsu, editarDadosUsu, cancelarEditarUsu, initPesquisaUsu, regexFormUsu, limparUsuarios } from "./usuarios.js";
import { verificar_key, fazerLogin, sair } from "./login.js";
import { showLoader, load_dn, dia_noite, abrirPopup, fecharPopup, scrollbtn} from "./ui.js";
    import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";
      const dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: document.querySelector("#dotlottie-canvas"),
        src: "https://lottie.host/175e6a0e-21f9-4a53-b2c4-006aebb9a223/GQuEhzf2Ij.lottie",
      });

const foto = document.getElementById("foto");



window.verificar_key = verificar_key;
window.listarFunc = listarFunc;
window.fazerLogin = fazerLogin;
window.sair = sair;
window.showLoader = showLoader;
window.registrar = registrar;
window.deletar = deletar;
window.editar = editar;
window.editarDados = editarDados;
window.cancelarEditar = cancelarEditar;
window.load_dn = load_dn;
window.dia_noite = dia_noite;
window.regextel = regextel;
window.regexpes = regexpeso;
window.regexalt = regexalt;
window.confirmarLimpar= confirmarLimpar
window.limparFuncionarios = limparFuncionarios;
window.limparUsuarios = limparUsuarios;
window.preencherFake = preencherFake;
window.gerarRelatorio = gerarRelatorio;
window.gerarPDF = gerarPDF;
window.abrirPopup = abrirPopup;
window.fecharPopup = fecharPopup;
window.scrollbtn = scrollbtn;
window.limparCampos = limparCampos


window.listarUsu = listarUsu;
window.registrarUsu = registrarUsu;
window.deletarUsu = deletarUsu;
window.editarUsu = editarUsu;
window.editarDadosUsu = editarDadosUsu;
window.cancelarEditarUsu = cancelarEditarUsu;
window.regexFormUsu = regexFormUsu;


// Inicializa campo de pesquisa
window.inicializarPagina = () => {
    initPesquisa("pesquisa", "listaFunc"); 
}
window.inicializarPaginaUsu = () => {
    initPesquisaUsu("pesquisa", "lista_usu");
}


// Inicializa funções da registrar funcionario
window.inicializarRegFunc = () => {
  verificar_key();                  // Verifica login
  load_dn();                        // Aplica tema dia/noite
  // Inicializa regex do formulario
    regextel();
    regexpeso();
    regexalt();
};


  // Inicializa funções da registrar usuario
window.inicializarRegUsu = () => {
  verificar_key();                  // Verifica login
  load_dn();                        // Aplica tema dia/noite
  // Inicializa regex do formulario
  regexFormUsu();
};



  // Inicializa funções da listar funcionario
window.inicializarListFunc = () => {

    listarFunc();
    verificar_key();
    showLoader();
          setTimeout(load_dn, 1000);
};

  // Inicializa funções da listar usuario
window.inicializarListUsu = () => {
    load_dn();
    listarUsu();
    verificar_key();
    showLoader();
};

window.initSobre = () => {
  load_dn();
  verificar_key();
      
      foto.style.display = "none";
} 

let ultimoScroll = 0;
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
      let atualScroll = window.scrollY;

      if (atualScroll > ultimoScroll) {
        // rolando para baixo → esconde
        navbar.classList.remove("show");
      } else {
        // rolando para cima → mostra
        navbar.classList.add("show");
      }

      ultimoScroll = atualScroll;
    });

    // Mostrar nav logo no início
    navbar.classList.add("show");


    // Mostrar o scroll to top 
const scrolltotop = document.getElementById("scrolltotop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) { // quando rolar mais de 200px
    scrolltotop.style.opacity = "1"; 
  } else {
    scrolltotop.style.opacity = "0"; 
  }
});



    // Chama a API de CEP
window.btnBuscarCEP = () => {
  let cep = document.getElementById("cep").value
  buscarCEP(cep);
}