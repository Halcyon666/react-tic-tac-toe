import { useState } from "react";

export function Square({ onSquareClick, value }) {
  return (
    <button
      onClick={onSquareClick}
      className="bg-[#0f172a] text-[whitesmoke] border-solid border border-[whitesmoke] float-left text-[72px] font-bold leading-[168px] h-[168px] w-[168px] -mr-[1px] -mt-[1px] p-0 text-center"
    >
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  const [length] = useState(3);

  const caculateWinner = (squares) => {
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

    // remember seperator is semicolone
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  // this handle click to fill content
  const handleClick = (index) => {
    // if there filled or win then do nothing
    if (squares[index] || caculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    // change the status you need to use setXIsNext, instead of `xIsNext = !xIsNext;`
    // setXIsNext(!xIsNext);
    // change the player and set history
    onPlay(nextSquares);
  };

  const squaresElement = Array.from({ length: length * length }, (_, index) => (
    //  Too many re-renders. React limits the number of renders to prevent an infinite loop.
    // 1. do not call `handleClick(index)` instead of `() => handleClick(index)`
    // 2. and use the event onXxx to pass a click function to children component
    <Square
      key={index}
      value={squares[index]}
      onSquareClick={() => handleClick(index)}
    />
  ));

  // judge the winner
  let tips;
  const winner = caculateWinner(squares);
  if (winner) {
    tips = `The winner: ${winner}`;
  } else {
    tips = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="text-center mt-4 p-2 text-2xl text-[whitesmoke] font-bold border border-solid border-purple-400 shadow-lg shadow-cyan-500/50 bg-cyan-500 opacity-85">
          {tips}
        </div>
      </div>
      <div className="flex justify-center my-8 ">
        <div className="grid grid-cols-3">{squaresElement}</div>
      </div>
    </div>
  );
}

export default function Game() {
  // if u need share a state between different childrens components, just define a status in parent component
  // const [xIsNext, setXIsNext] = useState(true);
  // Notice how [Array(9).fill(null)] is an array with a single item, which itself is an array of 9 nulls.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // default current move is zero
  const [currentMove, setCurrentMove] = useState(0);
  // currentSquare
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  // param passed by Board  ` onPlay(!xIsNext);`
  const handlePlay = (nextSquares) => {
    // first currentMove = 0, and next history length is 2, 
    // the next move is nextHistory.length-1 also can be currentMove+1,
    // when click, slice (0, 1) to include the nextSquares.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(history.length);
    // setXIsNext(!xIsNext);
  };

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, index) => {
    let description;
    if (index > 0) {
      description = "Go to move #" + index;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="flex justify-evenly">
      <Board onPlay={handlePlay} xIsNext={xIsNext} squares={currentSquares} />
      <div className="mt-24 mr-40 text-[whitesmoke] text-center pt-20 text-2xl h-[500px] w-[500px] border border-solid border-purple-400 shadow-lg shadow-cyan-500/50 bg-cyan-500 opacity-85">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
