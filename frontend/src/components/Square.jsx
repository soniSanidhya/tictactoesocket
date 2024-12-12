import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function Square({ value, onSquareClick, isWinningSquare }) {
  const variants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    hover: { scale: 1.05, y: -4 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.button
      className={clsx(
        'game-square',
        isWinningSquare && 'winner',
        value === 'X' && 'x-mark',
        value === 'O' && 'o-mark'
      )}
      onClick={onSquareClick}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
}