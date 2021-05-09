const playBtn = document.querySelector('.play-btn');
const input = document.querySelector('input');
const restartBtn = document.querySelector('.restart-btn');
const cells = document.querySelectorAll('td');
const gameStatus = document.querySelector('.game-status');

class TicTacToe {
  constructor() {
    this.players = ['X', 'O'];
    this.board = ['', '', '', '', 'X', '', '', '', ''];
    this.winner = '';
    this.scores = {
          X: 1,
          O: -1,
          tie: 0
        }
  }

  startGame = () => {
    restartBtn.addEventListener('click', this.reset);

    playBtn.addEventListener('click', () => this.handleClick());

    cells.forEach((cell, i) => {
      cell.addEventListener('click', () => this.handleClick(i));
    });
  }

  handleClick = index => {
    let pos = index !== undefined ? index : input.value - 1;

    if (this.board[pos] === '' && this.winner === '') {
      this.updateBoard(pos, this.players[1]);

      let win = this.checkWin(pos);
      this.checkGameState(win, this.players[1]);
    }
    input.value = '';
  }

  equals = (a, b, c) => a !== '' && a === b && a === c;

  updateBoard = (pos, player) => {
    this.board[pos] = player;
    cells[pos].innerText = player;
  }

  availableSpaces = () => {
    let available = 0;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === '') available += 1;
    }
    return available;
  }

  checkGameState = (win, player) => {
    let spaces = this.availableSpaces();
    if (win || spaces === 0) this.endGame(win && player);
    else if (player === this.players[1]) this.makeMove();
  }

  checkWin = pos => {
    let board = [...this.board];
    let rowPos = Math.floor(pos / 3);
    let colPos = pos - 3 * rowPos;

    let row = board.slice(rowPos * 3, rowPos * 3 + 3);
    let column = [this.board[colPos], board[colPos + 3], this.board[colPos + 6]];

    /* all row or column elements are thesame */
    if (this.equals(...row) || this.equals(...column)) return true;

    /* all elements of either diagonals are thesame */
    if (pos % 2 === 0) {
      if (this.equals(board[2], board[4], board[6]) || 
        this.equals(board[0], board[4], board[8])) return true; 
    }

    return false;
  }

  endGame = player => {
    gameStatus.style.opacity = 1;
    if (player) {
      this.winner = player;
      gameStatus.innerText = `${player} won!`;
    } else {
      this.winner = 'tie';
      gameStatus.innerText = 'Game ended in a tie!';
    }
  }

  makeMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let pos = i * 3 + j;
        if (this.board[pos] === '') {
          this.board[pos] = this.players[0];
          let score = this.minimax(false, pos);
          this.board[pos] = '';
          if (score > bestScore) {
            bestScore = score;
            move = {i, j};
          }
        }
      }
    }

    let pos = move.i * 3 + move.j;
    this.updateBoard(pos, this.players[0]);

    let win = this.checkWin(pos);
    this.checkGameState(win, this.players[0]);
  }

  minimax = (isMaximizing, pos) => {
    let player = isMaximizing ? this.players[1] : this.players[0];
    let win = this.checkWin(pos);
    let spaces = this.availableSpaces();
    
    if (win || spaces === 0) {
      return this.scores[win ? player : 'tie'] * (spaces || 1);
    }

    return isMaximizing ? this.loop(-Infinity, true) : this.loop(Infinity, false); 
  }

  loop = (bestScore, isMaximizing) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let pos = i * 3 + j;
        if (this.board[pos] === '') {
          this.board[pos] = isMaximizing ? this.players[0] : this.players[1];
          let score = this.minimax(!isMaximizing, pos);
          this.board[pos] = '';

          if (isMaximizing) bestScore = Math.max(bestScore, score);
          else bestScore = Math.min(bestScore, score);
        }
      }
    }
    return bestScore;
  }

  reset = () => {
    this.board = ['', '', '', '', 'X', '', '', '', ''];
    this.winner = '';
    cells.forEach((c, i) => c.innerText = i !== 4 ? '' : 'X');
    gameStatus.style.opacity = '0';
  }
} 

const tictactoe = new TicTacToe();
tictactoe.startGame();