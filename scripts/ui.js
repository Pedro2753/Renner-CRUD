const loader = document.getElementById("loader");


export function showLoader() {
  loader.hidden = false;
  document.documentElement.style.setProperty("cursor", "progress");
  setTimeout(() => hideLoader(), 1000);
}

export function hideLoader() {
  loader.style.display = "none";
  document.documentElement.style.removeProperty("cursor");
}

export function scrollbtn(){
   window.scrollTo({ top: 0, behavior: "smooth" });
}

export function dia_noite() {
  let mybody = document.getElementById("body");
  let mysection = document.getElementById("reg_usu");
  let myform = document.getElementById("form");
  let myfunc = document.querySelectorAll("div#func");
  let mylist = document.getElementById("listaFunc");
  let mylist2 = document.getElementById("lista_usu");
  let myfooter = document.querySelector("footer")
  let mypopup = document.getElementById("popup")
  let imgscroll = document.getElementById("imgscroll")
  let myinput = document.querySelectorAll(
    ".form-group input, .form-group select"
  );
  let mybodysave = "";
  if (mybody.style.background == "white") {
    mybody.style.background = "#1F1F1F";
    myform.style.background = "#171717";
    mysection.style.background = "#1F1F1F";
    myform.style.color = "#ffffffff";
    mylist.style.color = "#ffffffff";
    myfooter.style.color = "#ffffffff";
    mylist2.style.color = "white"
    imgscroll.src = "./media/up.png"
    myinput.forEach((campo) => {
      campo.style.background = "#1F1F1F"; // cor de fundo
      campo.style.color = "white"; // cor do texto
    });
        myfunc.forEach((campo) => {
    campo.style.background = "#1F1F1F";
    campo.style.color = "#ffffffff";
    });
    mybodysave = "#1F1F1F";
    mypopup.style.background = "#1F1F1F"
    mypopup.style.color = "#ffffffff"
  } else {
    mybody.style.background = "white";
    myform.style.background = "#FEFEFE";
    mysection.style.background = "#FEFEFE";
    myform.style.color = "#1F1F1F";
    imgscroll.src = "./media/up-dark.png"
    mylist.style.color = "#1F1F1F";
    myfooter.style.color = "#000000ff";
    mylist2.style.color = "#1F1F1F"

    myinput.forEach((campo) => {
      campo.style.background = "#FEFEFE"; // cor de fundo
      campo.style.color = "#1F1F1F"; // cor do texto
      campo.style.borderWidth = "1px";
    });
        myfunc.forEach((campo) => {
    campo.style.background = "#ffffffff";
    campo.style.color = "#171717";
    });
    mypopup.style.background = "#f3f3f3ff";
    mypopup.style.color = "#000000ff";
    mybodysave = "white";
  }
  localStorage.setItem("mybodysave", mybodysave);
}

export function load_dn() {
  let mybody = document.getElementById("body");
  let mysection = document.getElementById("reg_usu");
  let  myform = document.getElementById("form");
  let mylist2 = document.getElementById("lista_usu");
  let myfunc = document.querySelectorAll("div#func");
  let mylist = document.getElementById("listaFunc");
  let myfooter = document.querySelector("footer")
  let mypopup = document.getElementById("popup")
  let imgscroll = document.getElementById("imgscroll")
  let myinput = document.querySelectorAll(
    ".form-group input, .form-group select"
  );
  mybody.style.background = localStorage.getItem("mybodysave");
  if (mybody.style.background == "white") {
    mybody.style.background = "white";
    myform.style.background = "#FEFEFE";
    mysection.style.background = "#FEFEFE";
    myform.style.color = "#1F1F1F";
    imgscroll.src = "./media/up-dark.png"
    mylist.style.color = "#1F1F1F";
    mylist2.style.color = "#1F1F1F"
    myfooter.style.color = "#000000ff";
    myinput.forEach((campo) => {
      campo.style.background = "#FEFEFE"; // cor de fundo
      campo.style.color = "#1F1F1F"; // cor do texto
      campo.style.borderWidth = "1px";
    });
    myfunc.forEach((campo) => {
    campo.style.background = "#ffffffff";
    campo.style.color = "#171717";
    });
    mypopup.style.background = "#ffffffff";
    mypopup.style.color = "#000000ff";
  } else {
    mybody.style.background = "#1F1F1F";
    myform.style.background = "#171717";
    mysection.style.background = "#1F1F1F";
    imgscroll.src = "./media/up.png"
    mylist.style.color = "#ffffffff";
    mylist2.style.color = "white"
    myform.style.color = "#ffffffff";
    myfooter.style.color = "#ffffffff";
    myinput.forEach((campo) => {
      campo.style.background= "#1F1F1F"; // cor de fundo
      campo.style.color = "white"; // cor do texto
    });
        myfunc.forEach((campo) => {
    campo.style.background = "#1F1F1F";
    campo.style.color = "#ffffffff";
    });
    mypopup.style.background = "#1F1F1F";
    mypopup.style.color = "#ffffffff";
  }
}

export async function abrirPopup() {
      document.getElementById("overlay").style.display = "flex";
    }

export function fecharPopup() {
      document.getElementById("overlay").style.display = "none";
    }