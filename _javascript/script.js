// Elementos
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const scoreElement = document.querySelector('.score');
const livesContainer = document.querySelector('#lives-container'); // Novo seletor
const bullet = document.querySelector('.bullet');
const gameOverScreen = document.querySelector('.game-over-screen');
const jogarDenovoScreen = document.querySelector('.tela-jogar-denovo');
const finalScoreElement = document.querySelector('#final-score');
const gameBoard = document.querySelector('.game-board');
const root = document.documentElement;
const clouds = document.querySelector('.clouds');
const starLayer = document.querySelector('#star-layer');
const infernoBackground = document.querySelector("#inferno-background");


//Tela inicial
const telaInicial = document.querySelector('.tela-Inicial');
const nicknameInput = document.querySelector('#nickname');
const startButton = document.querySelector('#start-button');

// Áudios e Imagens Padrão
var musicaMario = new Audio('./_media/_sons/trilhasonoramario.mp3');
const jumpSound = new Audio('./_media/_sons/jump.mp3');
const selectSound = new Audio('./_media/_sons/undertale-select.mp3');
const coinSound = new Audio('./_media/_sons/coin-audio.mp3');
var localGameOver = './_imagens/morte/game-over-mario.png';

// Variáveis de Estado do Jogo
let pausa = false;
let estaInvuneravel = false;
var vida = 3;
let score = 0;
let moedasColetadas = 0;
let playerNick = '';
let loop;
let scoreInterval;
let personagemSelecionadoId = 'marioDiv';

// Flags para controlar as mudanças de tema
let tardeAtivada = false;
let noiteAtivada = false;
let infernoAtivado = false;

function atualizarVidas() {
    livesContainer.innerHTML = ''; // Limpa as vidas atuais
    for (let i = 0; i < vida; i++) {
        const lifeIcon = document.createElement('img');
        lifeIcon.src = './_media/life.gif';
        lifeIcon.classList.add('life-icon');
        livesContainer.appendChild(lifeIcon);
    }
}

const jump = () => {
    if (!mario.classList.contains('jump')) {
        mario.classList.add('jump');
        jumpSound.play();
        setTimeout(() => mario.classList.remove('jump'), 500);
    }
}

function perdeVida() {
    vida--;
    atualizarVidas(); // mudar Vida na tela
}

function ativarInvunerabilidade() {
    estaInvuneravel = true;
    mario.classList.add('invuneravel');
    setTimeout(() => {
        estaInvuneravel = false;
        mario.classList.remove('invuneravel');
    }, 50000);
}

function salvarPontuacao(nomeJogador, pontuacaoFinal) {
    const dados = { name: nomeJogador, score: pontuacaoFinal };
    fetch('./_php/salvar_pontuacao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => console.log('Resposta do PHP:', data.message))
        .catch((error) => console.error('Ocorreu um erro na comunicação:', error));
}

// Códigos Secretos
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
    mario.style.transform = 'scaleX(1)';
});
const checkPalmeiras = checarCodigo(palmeirasCode, () => {
    mario.src = './_imagens/matheus.png';
    mario.style.transform = 'scaleX(1)';
});
const checkSonic = checarCodigo(sonicCode, () => {
    mario.src = './_media/sonic.gif';
    mario.style.transform = 'scaleX(1)';
});

function criarBrasa() {
    const ember = document.createElement('div');
    ember.classList.add('ember');
    ember.style.left = `${Math.random() * 100}%`; // Posição horizontal aleatória
    // Atraso aleatório para que não subam todas juntas
    ember.style.animationDelay = `${Math.random() * 3}s`;
    gameBoard.appendChild(ember);
}

function startGame() {
    telaInicial.style.display = 'none';
    pipe.style.animationPlayState = 'running';
    root.style.setProperty('--velocidade', `2.0s`);
    atualizarVidas(); // Desenha as vidas iniciais

    scoreInterval = setInterval(() => {
        if (!pausa) score++;
        scoreElement.textContent = `Score: ${score}`;

        // AUMENTO PROGRESSIVO DE VELOCIDADE (A cada 1 pontos)
        if (score % 1 === 0 && score > 0 && !infernoAtivado && !pausa) {
            let velocidadeAtual = parseFloat(getComputedStyle(root).getPropertyValue('--velocidade'));
            console.log(velocidadeAtual)
            if (velocidadeAtual > 1.5) {
                let novaVelocidade = Math.max(1.5, velocidadeAtual - 0.001);
                root.style.setProperty('--velocidade', `${novaVelocidade.toFixed(3)}s`);
            }
        }

        // MUDANÇAS DE TEMA
        if (score >= 500 && !tardeAtivada) {
            gameBoard.className = 'game-board theme-tarde';
            starLayer.style.display = 'block';
            musicaMario.pause();
            musicaMario = new Audio('./_media/_sons/HoraDeAventura.mp3');
            musicaMario.play();
            tardeAtivada = true;
        }
        if (score >= 1000 && !noiteAtivada) {
            starLayer.classList.replace("star-layer-tarde", "star-layer");
            starLayer.style.display = 'block';
            starLayer.style.animation = 'brilha-estrela-animation 5s infinite linear';
            gameBoard.className = 'game-board theme-noite';
            musicaMario.pause();
            musicaMario = new Audio('./_media/_sons/silkSong.mp3');
            musicaMario.play();
            noiteAtivada = true;
        }
        if (score >= 10 && !infernoAtivado) {
            gameBoard.className = 'game-board theme-infernal';
            root.style.setProperty('--velocidade', '1.0s');
            clouds.src = './_media/minecraft-ghast.gif';
            musicaMario.pause();
            musicaMario = new Audio('./_media/_sons/DoomEternal.mp3');
            musicaMario.play();
            gameBoard.classList.add('tremer'); // Ativa o tremor
            infernoBackground.style.display = 'block'; // Mostra o fundo de rochas
            // document.querySelector('.onda-calor').style.display = 'block';


            for (let i = 0; i < 50; i++) {
                criarBrasa();
            }
            infernoAtivado = true;


        }

        // LÓGICA DE BULLET (Corrigida)
        if (score >= 500 && bullet.style.display !== 'block') {
            bullet.style.display = 'block';
            bullet.style.animationPlayState = 'running';
        }

        // LÓGICA DE MOEDAS
        if (score > 0 && score % 50 == 0) {
            let alturaAleatoria = Math.random() * (200 - 80) + 80;
            criarMoeda(alturaAleatoria);
        }
    }, 100);

    loop = setInterval(() => {
        if (pausa || estaInvuneravel) return;
        musicaMario.play();

        const marioPositionBottom = +window.getComputedStyle(mario).bottom.replace('px', '');
        const marioPositionLeft = mario.offsetLeft;

        document.querySelectorAll('.coin').forEach((moeda) => {
            const moedaPositionLeft = moeda.offsetLeft;
            const moedaPositionBottom = +window.getComputedStyle(moeda).bottom.replace('px', '');

            if (
                marioPositionLeft < moedaPositionLeft + 40 &&
                marioPositionLeft + 120 > moedaPositionLeft &&
                marioPositionBottom < moedaPositionBottom + 40 &&
                marioPositionBottom + 120 > moedaPositionBottom
            ) {
                moeda.remove();
                coinSound.play();
                score += 10;
                moedasColetadas++;

                // Ganha vida a cada 25 moedas
                if (moedasColetadas % 25 === 0 && moedasColetadas > 0) {
                    vida++;
                    atualizarVidas(); // Redesenha as vidas na tela
                }
            }
        });

        const pipePosition = pipe.offsetLeft;
        const bulletPosition = bullet.offsetLeft;

        if ((pipePosition <= 120 && pipePosition > 0 && marioPositionBottom < 80) ||
            (bullet.style.display === 'block' && bulletPosition <= 120 && bulletPosition > 0 && marioPositionBottom < 80)) {
            perdeVida();
            pausa = true;
            pipe.style.animationPlayState = 'paused';
            bullet.style.animationPlayState = 'paused';

            if (vida > 0) {
                jogarDenovoScreen.style.display = 'flex';
            } else {
                morrer(pipePosition, bulletPosition, marioPositionBottom);
            }
        }
    }, 10);
}

document.addEventListener('keydown', (event) => {
    jump();
    checkKonami(event.key);
    checkRoberto(event.key);
    checkPalmeiras(event.key);
    checkSonic(event.key);
});

startButton.addEventListener('click', () => {
    const nick = nicknameInput.value.trim();
    if (nick) {
        playerNick = nick;
        startGame();
    } else {
        alert('Por favor, digite um nick para começar!');
    }
});

function escolhaPersonagem(personagem) {
    selectSound.currentTime = 0;
    selectSound.play();

    if (personagemSelecionadoId) {
        document.getElementById(personagemSelecionadoId).classList.remove('selecionado');
    }

    const novaSelecaoDiv = document.getElementById(`${personagem}Div`);
    if (novaSelecaoDiv) {
        novaSelecaoDiv.classList.add('selecionado');
        personagemSelecionadoId = `${personagem}Div`;
    }

    const caminhos = {
        mario: './_media/mario.gif', sonic: './_media/sonic.gif', megaman: './_media/yd6sCid.gif',
        link: './_media/link.gif', goku: './_media/goku.gif', jotaro: './_media/jotaroA.gif',
        hollow: './_media/hollow.gif', hornet: './_media/hornet.gif'
    };

    if (personagem == "jotaro") {
        localGameOver = `./_imagens/morte/game-over-${personagem}.gif`;
    } else {
        localGameOver = `./_imagens/morte/game-over-${personagem}.png`;
    }
    mario.src = caminhos[personagem] || caminhos.mario;
    mario.style.transform = (personagem === 'hollow' || personagem === 'hornet') ? 'scaleX(-1)' : 'scaleX(1)';
}

function continuarReniciar(escolha) {
    if (escolha === 'continuar') {
        jogarDenovoScreen.style.display = 'none';
        pipe.style.right = '-80px';
        pipe.style.left = '';
        pipe.style.animationPlayState = 'running';
        bullet.style.right = '-80px';
        bullet.style.left = '';
        bullet.style.animationPlayState = 'running';
        pausa = false;
        ativarInvunerabilidade();
    } else if (escolha === 'Reniciar') {
        window.location.reload();
    }
}

function morrer(pipePosition, bulletPosition, marioPosition) {
    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;
    bullet.style.animation = "none";
    bullet.style.left = `${bulletPosition}px`;
    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;
    mario.src = localGameOver;
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';
    gameOverScreen.style.display = 'flex';
    clearInterval(loop);
    clearInterval(scoreInterval);
    finalScoreElement.textContent = score;
    musicaMario.pause();
    salvarPontuacao(playerNick, score);
}

function criarMoeda(bottom) {
    const novaMoeda = document.createElement('img');
    novaMoeda.src = './_imagens/coin.png';
    novaMoeda.classList.add('coin');
    novaMoeda.style.bottom = `${bottom}px`;
    gameBoard.appendChild(novaMoeda);

    setTimeout(() => {
        if (novaMoeda) {
            novaMoeda.remove();
        }
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    const marioDiv = document.getElementById('marioDiv');
    if (marioDiv) {
        marioDiv.classList.add('selecionado');
    }
});