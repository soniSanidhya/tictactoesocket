import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function BotPage() {
  const sq = Array(9).fill(null);
  const [winner, setWinner] = useState(-1);
  const squaresRef = useRef([]);
  let botWorking = false;
  let block = false;

  const handleClick = (e, i) => {
    if (sq[i] == null && winner === -1 && botWorking === false) {
      sq[i] = "O";
      squaresRef.current[i].innerText = "O";
      checkWinner(sq);

      if (winner == -1) {
        botWorking = true;
        callForBot();
      }
    }
  };

  const callForBot = async () => {
    //console.log("Bot is working...");

    const genAI = new GoogleGenerativeAI(
      "AIzaSyBC6zuoUtwEA4O0_opzgfm58tl5mkdqRtA"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" , generationConfig : {temperature: 0.3, maxOutputTokens: 50, topP: 0.9, topK: 50}});
    const formattedString = sq
      .map((value, index) => `[value=${value}, index=${index}]`)
      .join(", ");

    //console.log(formattedString);

    const prompt = `You are a Tic Tac Toe bot. Make the next best move for position marked as 'X'.

        Current board state: ${formattedString}

        Rules:
        1. You MUST choose an empty position (where value is null)
        2. You play as 'X', opponent is O
        3. Prioritize in this order:
           - Winning move
           - Blocking opponent's winning move
           - Corner positions (0, 2, 6, 8) if empty
           - Center position (4) if empty
           - Any remaining empty side position (1, 3, 5, 7)

        Rules to follow:
1. Always make the best possible move for the given game state.
2. Try to win if there's a winning move available.
3. If there's no winning move, block the opponent's winning move.
4. If neither is possible, play strategically to maximize chances of winning in the future.
5. You are not allowed to make an illegal move.
6. If the game is already over, respond with the same game state.
7. You are not allowed to overwrite any cell containing X or O.
8. Respond with the new game state in the same format after making your move.
9. If multiple winning moves are available, choose the one that also blocks the opponent's potential winning path.
10. Prioritize taking the center square if it is available and advantageous.
11. Avoid moves that would allow the opponent to create a fork.
12. If the opponent is about to create a fork, force a defensive move by creating a threat.


        Return only a single number (0-8) representing your chosen position.
        The position must be empty (null) in the current board state.`;

       
        
    const result = await model.generateContent(prompt);

    // {
    //     prompt: prompt, // Provide the input prompt
    //     generationConfig: {
    //       temperature: 0.3,      // Logical and deterministic responses
    //       maxOutputTokens: 50,   // Restrict the output length
    //       topP: 0.9,             // Diverse but focused response
    //       topK: 50               // Consider the top 50 likely completions
    //     }
    //   }

      const responseText = result?.response?.text();
    //console.log(result);

    let i = Number(responseText) ;

    //console.log(i);
    
    if (sq[i] == null && winner === -1) {
        sq[i] = 'X';
        if (block == false) {
            //console.log(winner);

            squaresRef.current[i].innerText = 'X';
        }
        checkWinner(sq);
        botWorking = false;
    }
  };

  const checkWinner = (arr) => {
    if (arr[0] === arr[1] && arr[1] === arr[2] && arr[0] !== null) {
      setWinner(arr[0]);
      block = true;
      return;
    }
    if (arr[3] === arr[4] && arr[4] === arr[5] && arr[3] !== null) {
      setWinner(arr[3]);
      block = true;
      return;
    }
    if (arr[6] === arr[7] && arr[7] === arr[8] && arr[6] !== null) {
      setWinner(arr[6]);
      block = true;
      return;
    }
    if (arr[0] === arr[3] && arr[3] === arr[6] && arr[0] !== null) {
      setWinner(arr[0]);
      block = true;
      return;
    }
    if (arr[1] === arr[4] && arr[4] === arr[7] && arr[1] !== null) {
      setWinner(arr[1]);
      block = true;
      return;
    }
    if (arr[2] === arr[5] && arr[5] === arr[8] && arr[2] !== null) {
      setWinner(arr[2]);
      block = true;
      return;
    }
    if (arr[0] === arr[4] && arr[4] === arr[8] && arr[0] !== null) {
      setWinner(arr[0]);
      block = true;
      return;
    }
    if (arr[2] === arr[4] && arr[4] === arr[6] && arr[2] !== null) {
      setWinner(arr[2]);
      block = true;
      return;
    }
  };

  const boardVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold mb-6">
        Tic Tac Toe - AI Bot (Buggy "Highly")
      </h1>
      <div className="flex flex-col items-center space-y-6 md:space-y-0 md:flex-row md:items-start md:justify-center md:space-x-6 p-4">
        {/* Player Profile: Me */}
        <div className="text-center bg-gray-800/50 rounded-lg p-4 w-full max-w-xs md:max-w-sm">
          <img
            src="https://via.placeholder.com/100"
            alt="Me"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-white">Me</h2>
          <p className="text-gray-400">Symbol: X</p>
          <p className="text-gray-400">Score: 0</p>
          <div className="text-green-500">Active</div>
        </div>

        {/* Board */}
        <motion.div
          variants={boardVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-2 p-3 bg-gray-800/50 rounded-2xl backdrop-blur-sm w-full max-w-xs md:max-w-sm"
        >
          {sq.map((_, i) => (
            <div
              key={i}
              ref={(el) => (squaresRef.current[i] = el)}
              onClick={(e) => handleClick(e, i)}
              className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-gray-600 transition-colors"
            >
              {/* Square Content (Empty for now) */}
            </div>
          ))}
        </motion.div>

        {/* Player Profile: Bot */}
        <div className="text-center bg-gray-800/50 rounded-lg p-4 w-full max-w-xs md:max-w-sm">
          <img
            src="https://via.placeholder.com/100"
            alt="Bot"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-white">Bot</h2>
          <p className="text-gray-400">Symbol: O</p>
          <p className="text-gray-400">Score: 0</p>
          <div className="text-red-500">Inactive</div>
        </div>
      </div>

      {/* Winner Display */}
      {winner !== -1 && (
        <div className="mt-6 text-center text-2xl font-bold text-white">
          {winner === "X" ? "Bot Win!" : "You Wins!"}
        </div>
      )}
    </>
  );
}

export default BotPage;
