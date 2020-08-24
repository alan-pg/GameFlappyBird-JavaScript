"use strict";

var sprites = new Image();
sprites.src = './sprites.png';
var canvas = document.querySelector('canvas');
var contexto = canvas.getContext('2d');
var frames = 0;
var som_hit = new Audio();
som_hit.src = './efeitos/hit.wav'; // PLANO DE FUNDO

var planoDeFundo = {
  spritX: 390,
  spritY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha: function desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.drawImage(sprites, planoDeFundo.spritX, planoDeFundo.spritY, planoDeFundo.largura, planoDeFundo.altura, planoDeFundo.x, planoDeFundo.y, planoDeFundo.largura, planoDeFundo.altura);
    contexto.drawImage(sprites, planoDeFundo.spritX, planoDeFundo.spritY, planoDeFundo.largura, planoDeFundo.altura, planoDeFundo.x + planoDeFundo.largura, planoDeFundo.y, planoDeFundo.largura, planoDeFundo.altura);
  }
}; // MENSAGEM GET READY

var mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha: function desenha() {
    contexto.drawImage(sprites, mensagemGetReady.sX, mensagemGetReady.sY, mensagemGetReady.w, mensagemGetReady.h, mensagemGetReady.x, mensagemGetReady.y, mensagemGetReady.w, mensagemGetReady.h);
  }
}; // TELAS

var globais = {};
var telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

var Telas = {
  INICIO: {
    inicializa: function inicializa() {
      globais.flappyBird = creiaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha: function desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click: function click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza: function atualiza() {
      globais.chao.atualiza();
    }
  }
};
Telas.JOGO = {
  desenha: function desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click: function click() {
    globais.flappyBird.pula();
  },
  atualiza: function atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  }
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames = frames + 1;
  requestAnimationFrame(loop);
}

function fazColisao(flappyBird, chao) {
  var flappyBirdY = flappyBird.y + flappyBird.altura;
  var chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function creiaFlappyBird() {
  var flappyBird = {
    spritX: 0,
    spritY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    pula: function pula() {
      /* console.log('devo pular')
      console.log('antes', flappyBird.velocidade) */
      flappyBird.velocidade = -flappyBird.pulo;
      /* console.log('depois', flappyBird.velocidade) */
    },
    atualiza: function atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        som_hit.play();
        setTimeout(function () {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [{
      spriteX: 0,
      spriteY: 0
    }, //asa para cima
    {
      spriteX: 0,
      spriteY: 26
    }, //asa no meio
    {
      spriteX: 0,
      spriteY: 52
    }, //asa para baixo
    {
      spriteX: 0,
      spriteY: 26
    } //asa para baixo
    ],
    frameAtual: 0,
    atualizaFrameAtual: function atualizaFrameAtual() {
      var intervaloDeFrames = 10;
      var passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        var baseDoIncremento = 1;
        var incremento = baseDoIncremento + flappyBird.frameAtual;
        var baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha: function desenha() {
      flappyBird.atualizaFrameAtual();
      var _flappyBird$movimento = flappyBird.movimentos[flappyBird.frameAtual],
          spriteX = _flappyBird$movimento.spriteX,
          spriteY = _flappyBird$movimento.spriteY;
      contexto.drawImage(sprites, spriteX, spriteY, //sprite x , sprite y
      flappyBird.largura, flappyBird.altura, //tamanho do recorte na sprite
      flappyBird.x, flappyBird.y, flappyBird.largura, flappyBird.altura);
    }
  };
  return flappyBird;
} // CHÃO


function criaChao() {
  var chao = {
    spritX: 0,
    spritY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha: function desenha() {
      contexto.drawImage(sprites, chao.spritX, chao.spritY, chao.largura, chao.altura, chao.x, chao.y, chao.largura, chao.altura);
      contexto.drawImage(sprites, chao.spritX, chao.spritY, chao.largura, chao.altura, chao.x + chao.largura, chao.y, chao.largura, chao.altura);
    },
    atualiza: function atualiza() {
      var movimentoDoChao = 1;
      var repeteEm = chao.largura / 2;
      var movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % repeteEm;
    }
  };
  return chao;
}

function criaCanos() {
  var canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169
    },
    ceu: {
      spriteX: 52,
      spriteY: 169
    },
    espaco: 80,
    desenha: function desenha() {
      canos.pares.forEach(function (par) {
        var espacamentoEntreCanos = 90;
        var yRandon = par.y;
        var canoCeuX = par.x;
        var canoCeuY = yRandon;
        contexto.drawImage(sprites, canos.ceu.spriteX, canos.ceu.spriteY, canos.largura, canos.altura, canoCeuX, canoCeuY, canos.largura, canos.altura);
        var canoChaoX = par.x;
        var canoChaoY = canos.altura + espacamentoEntreCanos + yRandon;
        contexto.drawImage(sprites, canos.chao.spriteX, canos.chao.spriteY, canos.largura, canos.altura, canoChaoX, canoChaoY, canos.largura, canos.altura);
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        };
      });
    },
    temColisaoComOFlappyBird: function temColisaoComOFlappyBird(par) {
      var cabecaDoFlappy = globais.flappyBird.y;
      var peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if (globais.flappyBird.x >= par.x) {
        /* console.log('flappy inadio a area dos canos') */
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
    },
    pares: [],
    atualiza: function atualiza() {
      var passou100frames = frames % 100 === 0;

      if (passou100frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1)
        });
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          mudaParaTela(Telas.INICIO);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    }
  };
  return canos;
}

window.addEventListener('click', function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});
mudaParaTela(Telas.INICIO);
loop();