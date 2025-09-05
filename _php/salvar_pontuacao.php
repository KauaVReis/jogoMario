<?php
header('Content-Type: application/json');

// Inclui a conexão. A variável $conn vem de lá.
require 'conectar.php';

// Recebe e decodifica os dados JSON.
$json = file_get_contents('php://input');
$dados = json_decode($json);

// Validação dos dados.
if (!isset($dados->name) || !isset($dados->score)) {
    echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
    exit;
}

$name = $dados->name;
$score = $dados->score;


$sql_scores = "INSERT INTO scores (name, score) VALUES (?, ?)";
$stmt_scores = mysqli_prepare($conn, $sql_scores);
mysqli_stmt_bind_param($stmt_scores, "si", $name, $score);

if (!mysqli_stmt_execute($stmt_scores)) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar no histórico de scores.']);
    exit;
}
mysqli_stmt_close($stmt_scores); // Fechamos esta declaração para liberar recursos.



$sql_select = "SELECT score FROM Rank WHERE name = ? LIMIT 1";
$stmt_select = mysqli_prepare($conn, $sql_select);
mysqli_stmt_bind_param($stmt_select, "s", $name);
mysqli_stmt_execute($stmt_select);
$result = mysqli_stmt_get_result($stmt_select);

if (mysqli_num_rows($result) > 0) {
    // JOGADOR EXISTE: Compara o recorde.
    $row = mysqli_fetch_assoc($result);
    $recorde_antigo = $row['score'];

    if ($score > $recorde_antigo) {
        $sql_update = "UPDATE Rank SET score = ? WHERE name = ?";
        $stmt_update = mysqli_prepare($conn, $sql_update);
        mysqli_stmt_bind_param($stmt_update, "is", $score, $name);
        if (mysqli_stmt_execute($stmt_update)) {
            echo json_encode(['status' => 'success', 'message' => 'Novo recorde pessoal! Pontuação atualizada: ' . $score]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar o recorde.']);
        }
        mysqli_stmt_close($stmt_update);
    } else {
        // NÃO BATEU O RECORDE: Apenas informa.
        echo json_encode(['status' => 'info', 'message' => 'Sua pontuação de ' . $score . ' não superou seu recorde de ' . $recorde_antigo . '.']);
    }
} else {
    $sql_insert = "INSERT INTO Rank (name, score) VALUES (?, ?)";
    $stmt_insert = mysqli_prepare($conn, $sql_insert);
    mysqli_stmt_bind_param($stmt_insert, "si", $name, $score);
    if (mysqli_stmt_execute($stmt_insert)) {
        echo json_encode(['status' => 'success', 'message' => 'Primeira pontuação registrada no Rank com sucesso!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao registrar nova pontuação no Rank.']);
    }
    mysqli_stmt_close($stmt_insert);
}

// Fecha a declaração de select e a conexão principal no final de tudo.
mysqli_stmt_close($stmt_select);
mysqli_close($conn);
