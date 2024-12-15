import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigate();
  const [joinRandom, setJoinRandom] = useState(false);
  const [playWithBot , setPlaywithBot] = useState(false);

  const handleSubmission = (e) => {
    e.preventDefault();

    if(playWithBot){
      navigation(`/game/${name}/bot-multiplayer`)
      return;
    }
    
    if(joinRandom) {
      navigation(`/game/${name}/random`);
      return;
    }

    navigation(`/game/${name}/${roomId ? roomId : Math.random().toString(36).substring(7)}`);
    //console.log(roomId, name);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
      >
        Tic Tac Toe
      </motion.h1>
      <form onSubmit={handleSubmission} className="w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 space-y-4 sm:space-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.input
              onChange={(e) => setName(e.target.value)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              className="bg-transparent border border-white text-white p-2 rounded-lg w-full"
              placeholder="Enter your name"
              required={true}
              type="text"
            />
            <motion.input
              onChange={(e) => setRoomId(e.target.value)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              className="bg-transparent border border-white text-white p-2 rounded-lg w-full"
              placeholder="Join or Leave empty to create"
              type="text"
            />
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full border rounded-lg py-2 bg-blue-800 text-white hover:bg-blue-700 transition-colors duration-300"
          >
            {roomId ? "Join Room" : "Create Room"}
          </motion.button>
          <motion.button
            onClick={() => {
              setJoinRandom(true);
             
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full border rounded-lg py-2 bg-blue-800 text-white hover:bg-blue-700 transition-colors duration-300"
          >
            Join Random Room
          </motion.button>
          <motion.button
            onClick={() => {
              // setJoinRandom(true);
              setPlaywithBot(true);
              // navigation('/bot-multiplayer')
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full border rounded-lg py-2 bg-blue-800 text-white hover:bg-blue-700 transition-colors duration-300"
          >
            Play with bot
          </motion.button>
          </div>
      </form>
    </div>
  );
};

export default Room;
