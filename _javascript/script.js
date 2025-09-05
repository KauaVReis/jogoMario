// Elementos
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const scoreElement = document.querySelector('.score');
const bullet = document.querySelector('.bullet');
const gameOverScreen = document.querySelector('.game-over-screen');
const jogarDenovoScreen = document.querySelector('.tela-jogar-denovo');
const finalScoreElement = document.querySelector('#final-score');
const restartButton = document.querySelector('#restart-button');
const gameBoard = document.querySelector('.game-board');

//Tela inicial
const telaInicial = document.querySelector('.tela-Inicial');
const nicknameInput = document.querySelector('#nickname');
const startButton = document.querySelector('#start-button');

var musicaMario = new Audio('_media/trilhasonoramario.mp3');

const jumpSound = new Audio('./_media/_sons/jump.mp3');
let pausa = false;


const root = document.documentElement;
var velocidade = getComputedStyle(root).getPropertyValue('--velocidade');
var vida = 3;

let score = 0;
let playerNick = '';
let loop;
let scoreInterval;
let teste = "0"



const jump = () => {
    if (!mario.classList.contains('jump')) { // Evita pulo duplo
        mario.classList.add('jump');
        jumpSound.play();
        setTimeout(() => {
            if (teste == '1') {
                console.log("a")
            }
            mario.classList.remove('jump');
        }, 500);
    }
}

function perdeVida() {
    return vida--;
}



function salvarPontuacao(nomeJogador, pontuacaoFinal) {
    const dados = { name: nomeJogador, score: pontuacaoFinal };

    fetch('./_php/salvar_pontuacao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            console.log('Resposta do PHP:', data.message);
        })
        .catch((error) => {
            console.error('Ocorreu um erro na comunicação:', error);
            // alert('Não foi possível salvar a pontuação. Tente novamente mais tarde.');
            // Mesmo com erro, permite reiniciar
            restartButton.onclick = () => window.location.reload();
        });
}

//Codigos secretos
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const robertoCode = ['r', 'o', 'b', 'e', 'r', 't', 'o'];
const palmeirasCode = ['p', 'a', 'l', 'm', 'e', 'i', 'r', 'a', 's'];
const sonicCode = ['s', 'o', 'n', 'i', 'c'];

function checarCodigo(sequencia, evento) {
    let position = 0;
    return function (key) {
        if (key === sequencia[position]) {
            position++;
            if (position === sequencia.length) {
                evento();
                position = 0;
            }
        } else {
            position = (key === sequencia[0]) ? 1 : 0;
        }
    }
}

const checkKonami = checarCodigo(konamiCode, () => {
    mario.src = './_media/wario.gif';
    mario.style.transform = 'scaleX(-1)';
});
const checkRoberto = checarCodigo(robertoCode, () => {
    mario.src = './_imagens/image.png';
});
const checkPalmeiras = checarCodigo(palmeirasCode, () => {
    mario.src = './_imagens/matheus.png';
});
const checkSonic = checarCodigo(sonicCode, () => {
    mario.src = './_media/sonic.gif';
    teste = "1"
});

// Gerenciador de Estado do Jogo (Start / Game Over)

function startGame() {
    telaInicial.style.display = 'none';
    pipe.style.animationPlayState = 'running';


    scoreInterval = setInterval(() => {

        if (!pausa) {
            score++;
        }
        scoreElement.textContent = score;
        if (score % 100 == 0) {
            gameBoard.style.background = "linear-gradient(#0a0a40, #000000)";
        }
        if (score == 100) {
            musicaMario.pause();
            musicaMario = new Audio('_media/silkSong.mp3');
            musicaMario.play();

        }

        // if (score % 10 == 0) {
        //     var velocidade = getComputedStyle(root).getPropertyValue('--velocidade');
        //     console.log(score % 10)
        //     console.log(velocidade)
        //     var novaVelocidade = (parseInt(velocidade) - 0.01)
        //     console.log(novaVelocidade)
        //     root.style.setProperty(('--velocidade'), novaVelocidade + "s")
        // }
        if (score == 500) {
            bullet.style.animationPlayState = 'running';
        } else if (score > 483) {
            bullet.style.animationPlayState = 'paused';
            bullet.style.display = 'none';
        }
    }, 100);


    loop = setInterval(() => {
        musicaMario.play();
        const pipePosition = pipe.offsetLeft;
        const bulletPosition = bullet.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if ((pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) || (bulletPosition <= 120 && bulletPosition > 0 && marioPosition < 80)) {
            vida--
            pausa = true;
            jogarDenovoScreen.style.display = 'flex';
            pipe.style.animationPlayState = 'paused';
            mario.style.animation = "paused";
            mario.src = './_imagens/game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';


            if (vida == 3) {

                // Para o jogo
                pipe.style.animation = "none";
                pipe.style.left = `${pipePosition}px`;
                mario.style.animation = "none";
                mario.style.bottom = `${marioPosition}px`;



                clearInterval(loop);
                clearInterval(scoreInterval)
                // Mostra tela de Game Over e salva
                finalScoreElement.textContent = score;
                musicaMario.pause();
                salvarPontuacao(playerNick, score);
            }
        }
    }, 10);
}

// Event Listeners (Pontos de Entrada)

// Gerenciador de Teclado ÚNICO
document.addEventListener('keydown', (event) => {
    jump();
    // Verificadores de código
    checkKonami(event.key);
    checkRoberto(event.key);
    checkPalmeiras(event.key);
    checkSonic(event.key);
});

// Listener para o botão de início
startButton.addEventListener('click', () => {
    const nick = nicknameInput.value.trim();
    if (nick) {
        playerNick = nick;
        startGame();
    } else {
        alert('Por favor, digite um nick para começar!');
    }
});

// Listener para o botão de morte até reniciar
startButton.addEventListener('click', () => {
    const nick = nicknameInput.value.trim();

});

function escolhaPersonagem(personagem) {
    switch (personagem) {
        case "sonic":
            mario.src = './_media/sonic.gif';
            break;

        default:
            mario.src = './_media/mario.gif';

            break;
    }
}

function continuarReniciar(escolha) {
    if (escolha == 'continuar' && vida != 0) {
        vida--
        jogarDenovoScreen.style.display = 'none';
        pausa == true
        console.log(pausa)

    }

}