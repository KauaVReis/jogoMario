<?php
// Inclui seu arquivo de conexão para obter a variável $conn
require 'conectar.php';

$ranking_data = [];

$sql = "SELECT name, score FROM rank ORDER BY score DESC LIMIT 10";

$result = mysqli_query($conn, $sql);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $ranking_data[] = $row;
    }
}

mysqli_close($conn);
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranking do Jogo</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../_css/style.css">

    <style>
        :root {
            --game-font: "Press Start 2P", system-ui;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            /* Um fundo inspirado no jogo */
            background-image: linear-gradient(#87ceeb, #e0f6ff);
            background-attachment: fixed;
            font-family: var(--game-font);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* Container principal do Leaderboard */
        .leaderboard-container {
            width: 90%;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px 30px;
            background-color: rgba(20, 50, 150, 0.8);
            border: 4px solid rgba(255, 255, 255, 0.7);
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            color: white;
            text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.7);
        }

        .leaderboard-container h2 {
            text-align: center;
            font-size: 2rem;
            color: #f7d51d;
            margin-bottom: 20px;
        }

        #ranking-list {
            list-style: none;
            padding: 0;
            counter-reset: rank-counter;
        }

        #ranking-list li {
            display: flex;
            justify-content: space-between;
            padding: 12px 10px;
            font-size: 1.2rem;
            border-bottom: 2px dashed rgba(255, 255, 255, 0.2);
            counter-increment: rank-counter;
        }

        #ranking-list li::before {
            content: counter(rank-counter) ". ";
            font-weight: bold;
            color: #f7d51d;
            min-width: 40px;
        }

        #ranking-list li:first-child {
            color: #FFD700;
            font-weight: bold;
        }

        #ranking-list li:first-child::after {
            content: " 👑";
        }

        #ranking-list li:last-child {
            border-bottom: none;
        }

        .player-name {
            flex-grow: 1;
            /* Faz o nome ocupar o espaço disponível */
        }

        .player-score {
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="leaderboard-container">
        <h2>🏆 RANKING 🏆</h2>
        <ol id="ranking-list">
            <?php
            // Verifica se o array de ranking tem algum dado
            if (count($ranking_data) > 0) {
                // Loop para exibir cada jogador e sua pontuação
                foreach ($ranking_data as $player) {
                    // Usamos htmlspecialchars para segurança, prevenindo ataques XSS
                    echo '<li>';
                    echo '<span class="player-name">' . htmlspecialchars($player['name']) . '</span>';
                    echo '<span class="player-score">' . $player['score'] . '</span>';
                    echo '</li>';
                }
            } else {
                // Mensagem exibida se a tabela estiver vazia
                echo '<li>Nenhuma pontuação registrada ainda.</li>';
            }
            ?>
        </ol>
        <div class="rank-button-container">
            <a href="../index.html" class="rank-button">Jogar</a>
        </div>
    </div>


</body>

</html>