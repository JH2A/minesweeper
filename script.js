const width = 10;
const height = 10;
const bombCount = 10;
const game = document.getElementById('game');
const cells = [];

function createBoard() {
  const bombArray = Array(bombCount).fill('CO2');
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

function countAdjacentBombs(index) {
  const adj = [
    -1, 1, -width, width,
    -width - 1, -width + 1,
    width - 1, width + 1,
  ];
  let count = 0;

  for (let i of adj) {
    const target = cells[index + i];
    if (target && target.dataset.value === 'CO2') count++;
  }

  return count;
}

function gameOver() {
  alert('💥 残念！CO₂が漏れてきちゃったよ！！');
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
    alert('🎉 クリアおめでとう！！　応募キーワードは”水素キングダム”だよ');
    for (let cell of cells) {
      cell.removeEventListener('click', clickCell);
    }
  }
}

createBoard();
