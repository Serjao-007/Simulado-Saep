const API = "http://localhost:3000/api";
async function carregar() {
  const res = await fetch(`${API}/produtos`);
  const data = await res.json();
  const lista = document.getElementById("lista");
  lista.innerHTML = data
    .map(
      (p) => `
                <tr>
                    <td>${p.nome}</td><td>${p.estoque_atual}</td><td>${p.estoque_minimo}</td>
                    <td><button onclick="excluir(${p.id})">Excluir</button></td>
                </tr>
            `,
    )
    .join("");
}
async function salvar() {
  const p = {
    nome: document.getElementById("nome").value,
    tamanho: document.getElementById("tam").value,
    estoque_atual: document.getElementById("qtd").value,
    estoque_minimo: document.getElementById("min").value,
  };
  await fetch(`${API}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  carregar();
}
async function excluir(id) {
  await fetch(`${API}/produtos/${id}`, { method: "DELETE" });
  carregar();
}
const usuarioDados = localStorage.getItem("usuarioLogado");
if (usuarioDados) {
  const usuario = JSON.parse(usuarioDados);
  document.getElementById("user").textContent = `Bem-vindo ${usuario.nome}`;
} else {
  document.getElementById("user").textContent = "Bem-vindo visitante!";
}
carregar();
