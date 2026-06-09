const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "User-12910",
  database: "saep_db",
});
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados: " + err.stack);
    return;
  }
  console.log("Conectado com sucesso");
});
app.post("/api/login", (req, res) => {
  const { login, senha } = req.body;
  const sql = "SELECT id, nome FROM usuarios WHERE login = ? AND senha = ?";
  db.query(sql, [login, senha], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ sucesso: false, mensagem: "Erro no servidor" });
    if (results.length > 0) {
      res.json({ sucesso: true, usuario: results[0] });
    } else {
      res
        .status(401)
        .json({ sucesso: false, mensagem: "Usuário ou senha inválidos!" });
    }
  });
});
app.get("/api/produtos", (req, res) => {
  db.query("SELECT * FROM produtos ORDER BY nome ASC", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar produtos" });
    res.json(results);
  });
});
app.post("/api/produtos", (req, res) => {
  const { nome, tamanho, estoque_atual, estoque_minimo } = req.body;
  const sql =
    "INSERT INTO produtos (nome, tamanho, estoque_atual, estoque_minimo) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, tamanho, estoque_atual, estoque_minimo], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao cadastrar produto" });
    res.json({ sucesso: true });
  });
});
app.put("/api/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, tamanho, estoque_atual, estoque_minimo } = req.body;
  const sql =
    "UPDATE produtos SET nome = ?, tamanho = ?, estoque_atual = ?, estoque_minimo = ? WHERE id = ?";
  db.query(sql, [nome, tamanho, estoque_atual, estoque_minimo, id], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar produto" });
    res.json({ sucesso: true });
  });
});
app.delete("/api/produtos/:id", (req, res) => {
  db.query("DELETE FROM produtos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao excluir produto" });
    res.json({ sucesso: true });
  });
});
app.listen(3000, () => console.log("Server rodando🚀"));
