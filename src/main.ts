import Game from './game';

document.addEventListener('DOMContentLoaded', (event) => {
  let game = new Game('game-screen');
  game.start();
})