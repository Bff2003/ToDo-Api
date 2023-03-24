// API
const database = require('./database.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse form data
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// create the database
database.createDatabase("./createDatabase.sql");

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to see if the server is running
app.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

app.post('/createUtilizador', (req, res) => {
    // Verify if the parameters are present
    if (req.body.nome == undefined || req.body.email == undefined || req.body.password == undefined) {
        res.status(400).send("Missing parameters!");
        return;
    }
    // Create the user
    database.createUtilizador(req.body.nome, req.body.email, req.body.password, function (rowID) {
        res.status(200).send({
            "id": rowID,
            "message": "Utilizador criado com sucesso!"
        });
    }, function () {
        res.status(500).send("Erro ao criar utilizador!");
    });
});

app.post('/authenticateUtilizador', (req, res) => {
    // Verify if the parameters are present
    if (req.body.email == undefined || req.body.password == undefined) {
        res.status(400).send("Missing parameters!");
        return;
    }

    // Verify if the user is already authenticated
    if (req.cookies != undefined && req.cookies.user != undefined) {
        res.status(400).send("Utilizador já autenticado!");
        return;
    }

    // Authenticate the user
    database.authenticateUtilizador(req.body.email, req.body.password, function (authenticated) {
        // set the cookie
        res.cookie('user', authenticated, { maxAge: 900000, httpOnly: true });
        res.status(200).send("Utilizador autenticado com sucesso!");
    }, function () {
        res.status(500).send("Erro ao autenticar utilizador!");
    });
});

app.delete('/deleteUtilizador/:id', (req, res) => {

    // Verify if the parameters are present
    if (req.params.id == undefined) {
        res.status(400).send("Missing parameters!");
        return;
    }

    // Verify if the user is already authenticated
    if (req.cookies == undefined || req.cookies.user == undefined) {
        res.status(400).send("Utilizador não autenticado!");
        return;
    }

    // Delete the user
    database.deleteUtilizador(req.params.id, function () {
        res.status(200).send("Utilizador eliminado com sucesso!");
        console.log("Utilizador "+ req.params.id +" eliminado com sucesso!");
    }, function () {
        res.status(500).send("Erro ao eliminar utilizador!");
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}! (http://localhost:${port} | http://127.0.0.1:${port})`));

// Path: index.js