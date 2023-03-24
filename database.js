
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

function createDatabase(fileCreateDatabaseScript) {
    // read the file
    var fs = require('fs');
    fs.readFile(fileCreateDatabaseScript, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        // console.log(data);
        db.exec(data, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("Database created");
        });
    });
}

function deleteDatabase(fileDatabase) {
    var fs = require('fs');

    if (fs.existsSync(fileDatabase)) {
        fs.unlinkSync(fileDatabase);
        console.log("Database deleted");
    } else {
        console.log("Database not found");
    }
}

// ###############################
// # Utilizador
// ###############################

function createUtilizador(nome, email, password, onCreated = function (rowID) { }, onNotCreated = function () { }) {
    db.run(`INSERT INTO Utilizador(nome, email, password) VALUES(?, ?, ?)`, [nome, email, password], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotCreated();
        } else {
            onCreated(this.lastID);
        }
    });
}

function authenticateUtilizador(email, password, onAuthenticated = function (authenticated) { }, onNotAuthenticated = function () { }) {
    db.get(`SELECT * FROM Utilizador WHERE email = ? AND password = ?`, [email, password], function (err, row) {    
        if (err) {
            return console.error(err.message);
        }
        if (row == undefined) {
            onNotAuthenticated();
        } else {
            onAuthenticated(row);
        }
    });
}

function deleteUtilizador(id, onDeleted = function () { }, onNotDeleted = function () { }) {
    db.run(`DELETE FROM Utilizador WHERE id = ?`, [id], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotDeleted();
        } else {
            onDeleted();
        }
    });
}

function updateUtilizador(id, nome, email, password, onUpdated = function () { }, onNotUpdated = function () { }) {
    db.run(`UPDATE Utilizador SET nome = ?, email = ?, password = ? WHERE id = ?`, [nome, email, password, id], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotUpdated();
        } else {
            onUpdated();
        }
    });
}

// ###############################
// # Tarefa
// ###############################

function createTarefa(idUtilizador, titulo, descricao, dataCriacao, dataLimite, onCreated = function (rowID) { }, onNotCreated = function () { }) {
    db.run(`INSERT INTO Tarefa(idUtilizador, titulo, descricao, dataCriacao, dataLimite) VALUES(?, ?, ?, ?, ?)`, [idUtilizador, titulo, descricao, dataCriacao, dataLimite], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotCreated();
        } else {
            onCreated(this.lastID);
        }
    });
}

function deleteTarefa(id, onDeleted = function () { }, onNotDeleted = function () { }) {
    db.run(`DELETE FROM Tarefa WHERE id = ?`, [id], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotDeleted();
        } else {
            onDeleted();
        }
    });
}

function updateTarefa(id, titulo, descricao, dataLimite, onUpdated = function () { }, onNotUpdated = function () { }) {
    db.run(`UPDATE Tarefa SET titulo = ?, descricao = ?, dataLimite = ? WHERE id = ?`, [titulo, descricao, dataLimite, id], function (err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes == 0) {
            onNotUpdated();
        } else {
            onUpdated();
        }
    });
}

function getTarefa(id, onRetrieved = function (tarefa) { }, onNotRetrieved = function () { }) {
    db.get(`SELECT * FROM Tarefa WHERE id = ?`, [id], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        if (row == undefined) {
            onNotRetrieved();
        } else {
            onRetrieved(row);
        }
    });
}

function getTarefas(idUtilizador, onRetrieved = function (tarefas) { }, onNotRetrieved = function () { }) {
    db.all(`SELECT * FROM Tarefa WHERE idUtilizador = ?`, [idUtilizador], function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        if (rows == undefined) {
            onNotRetrieved();
        } else {
            onRetrieved(rows);
        }
    });
}

// ###############################

module.exports = {
    deleteDatabase: deleteDatabase,
    createDatabase: createDatabase,
    createUtilizador: createUtilizador,
    authenticateUtilizador: authenticateUtilizador,
    deleteUtilizador: deleteUtilizador,
    updateUtilizador: updateUtilizador,
    createTarefa: createTarefa,
    deleteTarefa: deleteTarefa,
    updateTarefa: updateTarefa,
    getTarefa: getTarefa,
    getTarefas: getTarefas,
    db: db
}