document.addEventListener("DOMContentLoaded", () => {
  const status = document.querySelector('.game-status');
  let gameStateArr = ['', '', '', '', '', '', '', '', ''];
  const cells = document.querySelectorAll('.cell');

  let conditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];

  let gameActive = true;
  let currentPlayer = "X";

  const winningMsg = () => `Player ${currentPlayer} has won! Congrats!`;

  const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
  
  const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
      const deadHeat = handleRandomAnswer();
      if (deadHeat) status.innerHTML = 'Dead Heat!'
      currentPlayer = 'X';
    }
  }

  status.innerHTML = currentPlayerTurn();

  const handleCellPlayed = (cell, id) => {
    gameStateArr[id] = currentPlayer;
    cell.innerHTML = currentPlayer;
  };

  // check for playing wrong cell
  const handlePcCellPlayed = (id) => {
    let pcCells = gameStateArr.reduce((acc, curr, id) => {
      if (curr === 'O') return [...acc, id];
      return acc;
    }, []);

    pcCells.push(id);
    pcCells = pcCells.sort();

    if (pcCells.length < 3) {
      return true;
    }

    let isWining = true;

    conditions.forEach(arr => {
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        if (pcCells.includes(arr[i])) count ++;
      }

      if (count === 3) isWining = false;
    });

    return isWining;
  }

  const handleRandomAnswer = () => {
    let fl = true;
    cells.forEach(cell => {
      if (cell.innerHTML === '' && fl) {
        const clickedCelId = parseInt(cell.getAttribute('data-cell-id'));

        if (handlePcCellPlayed(clickedCelId)) {
          gameStateArr[clickedCelId] = currentPlayer;
          cell.innerHTML = currentPlayer;
          fl = false;
        }
      }
    });

    return fl;
  };

  const handleCellClick = (e) => {
    const cell = e.target;
    const clickedCelId = parseInt(cell.getAttribute('data-cell-id'));
    if (gameStateArr[clickedCelId] !== "" || !gameActive) return;
    handleCellPlayed(cell, clickedCelId);
    handleResValidation();
  };

  const handleResValidation = () => {
    let wonRound = false;
    for (let i = 0; i < 8; i++) {
      const winCond = conditions[i];
      let a = gameStateArr[winCond[0]];
      let b = gameStateArr[winCond[1]];
      let c = gameStateArr[winCond[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        wonRound = true;
        break;
      }
    };

    if (wonRound) {
      status.innerHTML = winningMsg();
      gameActive = false;
      return;
    }

    handlePlayerChange();
  };

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
});

