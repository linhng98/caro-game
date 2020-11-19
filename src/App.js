import React from 'react';
import './index.scss';

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
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  handleClick = (i) => {
    const history = this.state.history;
    const idx = this.state.history.length - 1;
    const newSquares = history[idx].squares.slice();
    if (newSquares[i])
      return

    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: newSquares, }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  undoMove = () => {
    if (this.state.history.length === 1)
      return;

    const history = this.state.history;
    history.pop()

    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
    });
  }

  resetBoard = () => {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    });
  }

  renderSquare = (i) => {
    const idx = this.state.history.length - 1;
    return <Square
      value={this.state.history[idx].squares[i]}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    const idx = this.state.history.length - 1;
    const winner = calculateWinner(this.state.history[idx].squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;