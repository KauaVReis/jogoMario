<?php
$servername = "localhost";
$database = "banco01";
$username = "root";
$password = "";

//Cria a conexão
$conn = mysqli_connect($servername, $username, $password, $database);

//verifica conexão

if (!$conn) {
    die("Falha na conexão" . mysqli_connect_error());
}
// echo "Conectado com sucesso";


