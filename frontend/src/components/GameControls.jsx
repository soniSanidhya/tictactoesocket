import { motion } from 'framer-motion';

export default function GameControls({ onReset }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg font-semibold
                 shadow-lg shadow-indigo-500/30 hover:bg-indigo-500
                 transition-colors duration-300 text-base sm:text-lg"
      onClick={onReset}
    >
      New Game
    </motion.button>
  );
}