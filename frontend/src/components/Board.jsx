import { motion } from 'framer-motion';
import Square from './Square';
import { calculateWinner } from '../utils/gameLogic';

export default function Board({ xIsNext, squares, onPlay }) {
  const { winner, winningLine } = calculateWinner(squares);

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const boardVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={boardVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-3 gap-2  p-3  bg-gray-800/50 rounded-2xl backdrop-blur-sm w-full max-w-xs "
    >
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onSquareClick={() => handleClick(i)}
          isWinningSquare={winningLine?.includes(i)}
        />
      ))}
    </motion.div>
  );
}