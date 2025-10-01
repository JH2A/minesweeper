const width = 10;
const height = 10;
const bombCount = 10;
const game = document.getElementById('game');
const mikuruMessage = document.getElementById('mikuru-message');
const cells = [];
let gameEnded = false;

function createBoard() {
  const bombArray = Array(bombCount).fill('CO2');
  const emptyArray = Array(width * height - bombCount).fill('');
  const gameArray = [...bombArray, ...emptyArray].sort(() => Math.random() - 0.5);

  game.innerHTML = '';
  cells.length = 0;

  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.dataset.value = gameArray[i];
    cell.addEventListener('click', clickCell);
    cell.addEventListener('contextmenu', flagCell);
    game.appendChild(cell);
    cells.push(cell);
  }
}

function clickCell(e) {
  const cell = e.target;
  if (cell.classList.contains('revealed') || cell.classList.contains('flag') || gameEnded) return;

  cell.classList.add('revealed');

  if (cell.dataset.value === 'CO2') {
    cell.classList.add('bomb');
    cell.innerText = 'CO₂';
    gameOver();
  } else {
    const index = parseInt(cell.dataset.index);
    const count = countAdjacentBombs(index);
    cell.innerText = count > 0 ? count : '';
    checkWinCondition();
  }
}

function flagCell(e) {
  e.preventDefault();
  const cell = e.target;
  if (cell.classList.contains('revealed') || gameEnded) return;

  if (cell.classList.contains('flag')) {
    cell.classList.remove('flag');
    cell.innerText = '';
  } else {
    cell.classList.add('flag');
    cell.innerText = '🏳️';
  }
}

function countAdjacentBombs(index) {
  const x = index % width;
  const y = Math.floor(index / width);
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (cells[nIndex] && cells[nIndex].dataset.value === 'CO2') {
          count++;
        }
      }
    }
  }

  return count;
}

function gameOver() {
  gameEnded = true;
  showMessage('💥 残念！CO2が漏れてきちゃったよ！！');
  for (let cell of cells) {
    cell.removeEventListener('click', clickCell);
    if (cell.dataset.value === 'CO2') {
      cell.classList.add('revealed', 'bomb');
      cell.innerText = 'CO₂';
    }
  }
}

function checkWinCondition() {
  const unrevealed = cells.filter(cell =>
    !cell.classList.contains('revealed') &&
    cell.dataset.value !== 'CO2'
  );
  if (unrevealed.length === 0) {
    gameEnded = true;
    showMessage('🎉 クリアおめでとう！！　応募キーワードは”水素キングダム”だよ');
    for (let cell of cells) {
      cell.removeEventListener('click', clickCell);
    }
  }
}

function showMessage(text) {
  mikuruMessage.innerText = text;
  mikuruMessage.classList.add('show');
}

createBoard();
