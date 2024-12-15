import { useState } from "react";
import { motion } from "framer-motion";
import GameBoard from "./components/Board";
import GameStatus from "./components/GameStatus";
import GameControls from "./components/GameControls";
import PlayerProfile from "./components/PlayerProfile";
import { calculateWinner } from "./utils/gameLogic";
import { defaultAvatars } from "./utils/defaultAvatars";
import { useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Bot = () => {
  const { name } = useParams();
  console.log(name);
  
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const { winner } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square);

  //console.log(squares);
  //console.log(winner);
  

  function resetGame() {
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
      const updatedScores = { ...scores, [winner]: scores[winner] + 1 };
    }
    setSquares(Array(9).fill(null));
  }

  function handlePlay(nextSquares) {
    if (!xIsNext || winner || isDraw) return;

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
   
    
    //console.log("nextSquares", nextSquares);
    //console.log("winner", winner);
    
    if (!calculateWinner(nextSquares).winner) {
        
      setTimeout(async () => await callForBot(nextSquares), 500);
    }else{
        setXIsNext(true);
    }
  }


  

  const callForBot = async (currentSquares) => {
    //console.log("Bot is working...");

    const genAI = new GoogleGenerativeAI(
      import.meta.env.VITE_GOOGLE_API_KEY
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 50,
        topP: 0.9,
        topK: 50,
      },
    });

    // console.log(squares);

    const prompt = `You are a Tic Tac Toe bot. Make the next best move for position marked as 'O'.

        Current board state (0-8 positions):
        ${currentSquares.map((val, idx) => `${idx}: ${val || 'empty'}`).join(', ')}

        Rules:
        1. You MUST choose an empty position (where value is null)
        2. You play as 'O', opponent is 'X'
        3. Prioritize in this order:
           - Winning move
           - Blocking opponent's winning move
           - Corner positions (0, 2, 6, 8) if empty
           - Center position (4) if empty
           - Any remaining empty side position (1, 3, 5, 7)

        Available moves: ${currentSquares.map((val, idx) => val === null ? idx : null).filter(val => val !== null).join(', ')}

        Return only a single number from the available moves list representing your chosen position.`;

    const result = await model.generateContent(prompt);

    //console.log(result);
    
    const botMoveText = result.response.text();
    //console.log("Bot move:", botMoveText);
    
    const botMove = parseInt(botMoveText);
    setXIsNext(xIsNext);
    if (!isNaN(botMove) && currentSquares[botMove] === null) {
        //console.log("Square",currentSquares);
        
      const nextSquares = currentSquares.slice();
      nextSquares[botMove] = "O";
      setSquares(nextSquares);
    } else {
      console.error("Invalid move from bot:", botMove);
    }
  };

  return (
    <>
      {/* Mobile-friendly header with responsive layout */}

      {/* Responsive full-screen container with mobile-friendly spacing */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
        >
          Tic Tac Toe
        </motion.h1>

        {/* Responsive flex layout that stacks on smaller screens */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-6xl">
          <PlayerProfile
            name={name || "player"}
            symbol={"X"}
            avatar={defaultAvatars.X}
            isActive={xIsNext && !winner}
            score={scores.X || 0}
            className="w-full md:w-auto"
          />

          <div className="flex flex-col items-center gap-6 sm:gap-8 w-full md:w-auto">
            <GameStatus winner={winner} xIsNext={xIsNext} isDraw={isDraw} />
            <GameBoard
              xIsNext={xIsNext}
              squares={squares}
              onPlay={handlePlay}
            />
            <GameControls
              isDisabled={winner == null || isDraw ? true : false}
              onReset={resetGame}
            />
          </div>

          <PlayerProfile
            name={"Bot"}
            symbol={"O"}
            avatar={defaultAvatars.O}
            isActive={!xIsNext && !winner}
            score={scores.O || 0}
            className="w-full md:w-auto"
          />
        </div>
      </div>
    </>
  );
};

export default Bot;
