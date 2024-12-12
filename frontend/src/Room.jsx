import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigate();

  const handleSubmission = (e) => {
    e.preventDefault();
    navigation(`/game/${name}/${roomId ? roomId : Math.random().toString(36).substring(7)}`);
    console.log(roomId, name);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500"
      >
        Tic Tac Toe
      </motion.h1>
      <form onSubmit={handleSubmission}>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <motion.input
              onChange={(e) => setName(e.target.value)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 300 }}
              className="bg-transparent border border-white text-white p-2 rounded-lg"
              placeholder="Enter your name"
              required={true}

              // transition={{ delay: 0.5 , duration: 1}}
            ></motion.input>
            <motion.input
              onChange={(e) => setRoomId(e.target.value)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 300 }}
              className="bg-transparent border  border-white text-white p-2 rounded-lg"
              placeholder="Join or Leave empty to create"
            //   required={true}
              // transition={{ delay: 0.5 , duration: 1}}
            ></motion.input>
          </div>
          <motion.button
            // initial={{ opacity: 0, scale: 0 }}
            // whileHover={{ scale: 1.1 }}
            type="submit"
            whileTap={{ scale: 0.8 }}
            animate={{ type: "spring", stiffness: 300 }}
            className="border rounded-lg py-2  bg-blue-800"
          >
           { roomId ? "Join Room" : "Create Room"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Room;
