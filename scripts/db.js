export function abrirBanco() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("MeuBanco", 1);

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("variaveis")) {
        db.createObjectStore("variaveis", { keyPath: "nome" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject("Erro ao abrir banco: " + event.target.errorCode);
  });
}

export async function limparStore(nomeStore) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction(nomeStore, "readwrite");
    let store = tx.objectStore(nomeStore);
    let req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e);
  });
}
    export async function salvarVariavel(nome, valor) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction("variaveis", "readwrite");
    let store = tx.objectStore("variaveis");
    store.put({ nome, valor });
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e);
  });
}

export async function carregarVariavel(nome) {
  let db = await abrirBanco();
  return new Promise((resolve, reject) => {
    let tx = db.transaction("variaveis", "readonly");
    let store = tx.objectStore("variaveis");
    let req = store.get(nome);
    req.onsuccess = () => resolve(req.result ? req.result.valor : null);
    req.onerror = (e) => reject(e);
  });
}