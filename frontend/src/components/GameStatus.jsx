import { motion } from 'framer-motion';

export default function GameStatus({ winner, xIsNext, isDraw }) {
  const message = winner 
    ? `Winner: ${winner}` 
    : isDraw 
    ? "It's a draw!" 
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const colors = {
    X: 'text-rose-500',
    O: 'text-cyan-400',
    default: 'text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center ${
        isDraw ? colors.draw : 
        winner ? colors[winner] : 
        colors.default
      }`}
    >
      {message}
    </motion.div>
  );
}