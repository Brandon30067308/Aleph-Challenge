const form = document.querySelector('form');
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

  equals = (a, b, c) => a !== '' && a === b && a === c;

  availableSpaces = () => {
    let available = 0;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === '') available += 1;
    }
    return available;
  }

  click = (c, i) => {
    if (this.board[i] === '' && this.winner === '') {
      c.innerText = this.players[1];
      this.board[i] = this.players[1];

      let win = this.checkWin(i);
      this.checkGameState(win, this.players[1]);
    }
  }

  startGame = () => {
    restartBtn.addEventListener('click', this.reset);

    form.addEventListener('submit', e => {
      e.preventDefault();
      let index = form['player-move'].value;
      this.click(cells[index], index);
      form['player-move'].value = '';
    });
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

  checkWin = pos => {
    let board = [...this.board];
    let rowPos = Math.floor(pos / 3);
    let colPos = pos - 3 * rowPos;

    const row = board.slice(rowPos * 3, rowPos * 3 + 3);
    const column = [this.board[colPos], board[colPos + 3], this.board[colPos + 6]];

    /* all row or column elements are thesame */
    if (this.equals(...row) || this.equals(...column)) return true;

    /* all elements of either diagonals are thesame */
    if (pos % 2 === 0) {
      if (this.equals(board[2], board[4], board[6]) || 
        this.equals(board[0], board[4], board[8])) return true; 
    }

    return false;
  }

  checkGameState = (win, player) => {
    let spaces = this.availableSpaces();
    if (win || spaces === 0) this.endGame(win && player);
    else player === this.players[1] && this.makeMove();
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
    this.board[pos] = this.players[0];
    cells[pos].innerText = this.players[0];

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