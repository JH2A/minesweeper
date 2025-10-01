const width = 10;
const height = 10;
const bombCount = 10;
const game = document.getElementById('game');
const cells = [];

function createBoard() {
  const bombArray = Array(bombCount).fill('💣');
  const emptyArray = Array(width * height - bombCount).fill('');
  const gameArray = [...bombArray, ...emptyArray].sort(() => Math.random() - 0.5);

  game.innerHTML = '';
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.dataset.value = gameArray[i];
    cell.addEventListener('click', clickCell);
    game.appendChild(cell);
    cells.push(cell);
  }
}

function clickCell(e) {
  const cell = e.target;
  if (cell.classList.contains('revealed')) return;

  cell.classList.add('revealed');

  if (cell.dataset.value === '💣') {
    cell.classList.add('bomb');
    cell.innerText = '💣';
    gameOver();
  } else {
    const index = parseInt(cell.dataset.index);
    const count = countAdjacentBombs(index);
    cell.innerText = count > 0 ? count : '';
  }
}

function countAdjacentBombs(index) {
  const adj = [
    -1, 1, -width, width,
    -width - 1, -width + 1,
    width - 1, width + 1,
  ];
  let count = 0;

  for (let i of adj) {
    const target = cells[index + i];
    if (target && target.dataset.value === '💣') count++;
  }

  return count;
}

function gameOver() {
  alert('ゲームオーバー！');
  for (let cell of cells) {
    cell.removeEventListener('click', clickCell);
    if (cell.dataset.value === '💣') {
      cell.classList.add('revealed', 'bomb');
      cell.innerText = '💣';
    }
  }
}

createBoard();
