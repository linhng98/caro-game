import React from 'react';
import './index.scss';

const boardSize = 100
const winsize = 5

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(boardSize).fill(null),
      history: [],
      xIsNext: true
    };
  }

  handleClick = (i) => {
    if (calculateWinner(this.state.squares) || (this.state.squares[i] !== null)) {
      return;
    }

    const newHistory = this.state.history.slice();
    const newSquares = this.state.squares.slice();
    newHistory.push(i);

    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: newHistory,
      squares: newSquares,
      xIsNext: !this.state.xIsNext,
    });
  }

  undoMove = () => {
    if (this.state.history.length === 0) {
      return
    }

    const history = this.state.history
    const pos = history.pop()
    const newSquares = this.state.squares.slice()
    newSquares[pos] = null

    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      squares: newSquares,
    });
  }

  resetBoard = () => {
    this.setState({
      squares: Array(9).fill(null),
      history: [],
      xIsNext: true,
    });
  }

  renderSquare = (i) => {
    return <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    let winner
    const history = this.state.history
    if (history.length >= 9) {
      winner = calculateWinner(this.state.squares, history[history.length - 1]);
    } else {
      winner = undefined
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const renderRow = (i) => {
      const row = []
      for (let j = 0; j < boardSize; j++) {
        row.push(this.renderSquare(i * boardSize + j))
      }
      return row
    }

    let boards = []
    for (let i = 0; i < boardSize; i++) {
      boards.push(<div className="board-row">{renderRow(i)}</div>)
    }

    return (
      <div>
        <div className="status">{status}</div>
        {boards}
        <div>
          <button onClick={() => this.undoMove()}>undo</button>
          <button onClick={() => this.resetBoard()}>reset</button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
export default App;

function calculateWinner(squares, position) {
  const arrLen = winsize * 2 + 1
  const maxNum = boardSize * 2 - 1
  let result

  const arr = Array(arrLen).fill(null)

  for (let j = -(winsize - 1); j < winsize; j++) {
    for (let i = 0; i < arrLen - 1; i++) {
      let newpos = position + j
      if (newpos > 0 && newpos < maxNum && (Math.floor(newpos / winsize) === (Math.floor(position / winsize)))) {
        arr[i] = squares[newpos]
      } else {
        arr[i] = null
      }
    }
  }

  console.log(arr)
  result = largestSubString(arr)
  if (result !== null)
    return result
  return null
}

function largestSubString(arr) {
  let char = null
  let tmpchar = null
  let maxlen = 0
  let tmplen = 0

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === tmpchar) {
      tmplen = tmplen + 1
    } else {
      if (tmplen > maxlen) {
        char = tmpchar
        maxlen = tmplen
      }

      tmpchar = arr[i]
      tmplen = 1
    }
  }

  if (maxlen === winsize) {
    return char
  }

  return null
}


