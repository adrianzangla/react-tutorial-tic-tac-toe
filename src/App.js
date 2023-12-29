import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  const style = isWinning ? { background: "yellow" } : {};
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winningSquares = calculateWinner(squares);

  function handleClick(squareIndex) {
    if (calculateWinner(squares) || squares[squareIndex]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[squareIndex] = "X";
    } else {
      nextSquares[squareIndex] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  if (winningSquares) {
    status = "Winner: " + squares[winningSquares[0]];
  } else if (squares.every((square) => square)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    const rowSquares = [];
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j;
      const isWinning = winningSquares && winningSquares.includes(squareIndex);
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinning={isWinning}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [order, setOrder] = useState("Ascending");
  const currentSquares = history[currentMove];

  function toggleOrder() {
    setOrder(order === "Ascending" ? "Descending" : "Ascending");
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  function getMoveIndex(previousMove, currentMove) {
    return currentMove.findIndex(
      (element, i) => element !== null && previousMove[i] === null
    );
  }

  const moves = history.map((squares, move, history) => {
    let description;
    if (move > 0) {
      const moveIndex = getMoveIndex(history[move - 1], squares);
      description =
        "Go to move #" +
        move +
        ` (${Math.floor(moveIndex / 3) + 1}, ${(moveIndex % 3) + 1})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {order === "Ascending"
            ? moves.slice(0, -1)
            : moves.slice(0, -1).reverse()}
        </ol>
        <ol>You are at move #{currentMove}</ol>
      </div>
      <div className="game-info">
        <button onClick={toggleOrder}>{order}</button>
      </div>
    </div>
  );
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
      return lines[i];
    }
  }
  return null;
}
