import { carregarVariavel } from "./db.js";

let key = false;

export function verificar_key() {
  key = JSON.parse(localStorage.getItem("key") || false);
  if (key == false) {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("reg_usu").style.display = "none";
    document.getElementById("ul_nav").style.display = "none";
  } else {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("reg_usu").style.display = "block";
    document.getElementById("ul_nav").style.display = "flex";
  }
}

export function sair() {
  key = false;
  localStorage.setItem("key", JSON.stringify(key));
  verificar_key();
}

export async function fazerLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();
  const msg = document.getElementById("loginMensagem");

  const usuarios = (await carregarVariavel("usuarios")) || [];
  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

  if ((email == "admin@123" && senha == "admin") || usuario) {
    msg.style.color = "green";
    msg.textContent = "Login realizado com sucesso!";
    key = true;
    localStorage.setItem("key", JSON.stringify(key));
    setTimeout(() => {
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