import { useState } from "react";

export function Square({ onSquareClick, value }) {
  return (
    <button
      onClick={onSquareClick}
      className="bg-[#0f172a] text-[whitesmoke] border-solid border border-black float-left text-[72px] font-bold leading-[168px] h-[168px] w-[168px] mr-[-1px] mt-[-1px] p-0 text-center"
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [length] = useState(3);
  // if u need share a state between different childrens components, just define a status in parent component
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    // change the status you need to use setXIsNext, instead of `xIsNext = !xIsNext;`
    setXIsNext(!xIsNext);
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
    tips = `The winner: is ${winner}`;
  } else {
    tips = `Next Player: is ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="text-center text-2xl font-bold mt-4 p-2 border border-purple-400 border-solid shadow-lg shadow-cyan-500/50 bg-cyan-500">
          {" "}
          {tips}
        </div>
      </div>
      <div className="flex justify-center my-8 ">
        <div className="grid grid-cols-3">{squaresElement}</div>
      </div>
    </div>
  );
}
