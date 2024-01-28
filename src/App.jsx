import { useState } from "react";

export function Square({ onSquareClick, value, isHighlight }) {
  let bgcolor;
  if (isHighlight) {
    bgcolor = "bg-cyan-500 text-pink-500";
  } else {
    bgcolor = "bg-[#0f172a]";
  }

  return (
    <button
      onClick={onSquareClick}
      className={`${bgcolor} text-[whitesmoke] border-solid border border-[whitesmoke] float-left text-[72px] font-bold leading-[168px] h-[168px] w-[168px] -mr-[1px] -mt-[1px] p-0 text-center`}
    >
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  const [length] = useState(3);
  const [winningSquares, setWinningSquares] = useState([]);

  const calculateWinner = (squares) => {
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
        return [a, b, c];
      }
    }

    return null;
  };

  // this handle click to fill content
  const handleClick = (index) => {
    // if there filled or win then do nothing
    if (squares[index] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }

    const winnerArray = calculateWinner(nextSquares);
    if (winnerArray) {
      setWinningSquares(winnerArray);
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
      isHighlight={winningSquares.includes(index) ? true : false}
      onSquareClick={() => handleClick(index)}
    />
  ));

  // judge the winner
  let tips;
  const winnerArray = calculateWinner(squares);

  if (winnerArray) {
    tips = `The winner: ${squares[winnerArray[0]]}`;
  } else if (squares.every((square) => square === "X" || square === "O")) {
    tips = "The Game is over, result is being draw.";
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
  const [isAscend, setIsAscend] = useState(true);

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

  // not need this
  /*   function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }
 */

  // calculate location
  const getMoveLocation = (currentSquares, prevSquares) => {
    let moveIndex = 0;
    for (let i = 0; i < currentSquares.length; i++) {
      if (currentSquares[i] !== prevSquares[i]) {
        moveIndex = i;
        break;
      }
    }

    const row = Math.floor(moveIndex / 3) + 1;
    const col = (moveIndex % 3) + 1;

    return { row, col, moveIndex };
  };

  let moves = history.map((squares, index) => {
    let description;
    if (index > 0) {
      const moveLocation = getMoveLocation(squares, history[index-1]);
      description = `${ squares[moveLocation.moveIndex] } point at (${moveLocation.row}, ${moveLocation.col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={index}>
        <ol>{description}</ol>
      </li>
    );
  });

  const toggleOrder = () => {
    setIsAscend(!isAscend);
  };

  return (
    <div className="flex justify-evenly">
      <Board onPlay={handlePlay} xIsNext={xIsNext} squares={currentSquares} />

      <div className="mr-40 mt-4">
        <button
          onClick={toggleOrder}
          className="text-[whitesmoke] ml-44 mb-2 text-xl w-32 h-12 shadow-lg shadow-cyan-500/50 bg-lime-500 opacity-85 flex items-center justify-center"
        >
          {isAscend ? `Dscend` : "Ascend"}
        </button>
        <ol className="text-[whitesmoke] mt-8 text-center pt-20 text-xl h-[500px] w-[500px] border border-solid border-purple-400 shadow-lg shadow-cyan-500/50 bg-cyan-500 opacity-85">
          {isAscend ? moves : [moves[0], ...moves.slice(1).reverse()]}
        </ol>
      </div>
    </div>
  );
}
