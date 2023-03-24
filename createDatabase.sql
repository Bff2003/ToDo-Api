-- SQLite Todo List database 

-- Utilizador(nome, email, password)
CREATE TABLE IF NOT EXISTS Utilizador(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

-- Tarefa(idUtilizador, titulo, descricao, dataCriacao, dataLimite)
CREATE TABLE IF NOT EXISTS Tarefa(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUtilizador INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    dataCriacao TEXT NOT NULL,
    dataLimite TEXT NOT NULL,
    FOREIGN KEY(idUtilizador) REFERENCES Utilizador(id)
); 