import { motion } from 'framer-motion';

export default function PlayerProfile({ name, symbol, avatar, isActive, score , className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: symbol === 'X' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col max-md:flex-row max-md:justify-evenly items-center p-4 sm:p-6 rounded-xl ${
        isActive ? 'bg-gray-800/60' : 'bg-gray-800/30'
      } backdrop-blur-sm transition-colors duration-300 ${className}`}
    >
      <motion.div
        animate={{ 
          scale: isActive ? 1.1 : 1,
          borderColor: isActive ? 'rgb(99, 102, 241)' : 'rgb(75, 85, 99)'
        }}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 overflow-hidden mb-2 sm:mb-4`}
      >
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </motion.div>
     <div>
     <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-center">{name}</h2>
      <div className={`text-xl text-center w-full sm:text-2xl font-bold ${
        symbol === 'X' ? 'text-rose-500' : 'text-cyan-400'
      }`}>
        {symbol}
      </div>
      <div className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-300 text-center">
        Score: {score}
      </div>
     </div>
    </motion.div>
  );
}