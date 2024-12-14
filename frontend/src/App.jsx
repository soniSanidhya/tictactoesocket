import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GameBoard from "./components/Board";
import GameStatus from "./components/GameStatus";
import GameControls from "./components/GameControls";
import PlayerProfile from "./components/PlayerProfile";
import { calculateWinner } from "./utils/gameLogic";
import { defaultAvatars } from "./utils/defaultAvatars";
import { useNavigate, useParams } from "react-router-dom";

import { io } from "socket.io-client";

export default function App() {
  const { roomId : room, name } = useParams();

  const query = new URLSearchParams(window.location.search);

  // const {new}
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [roomId , setRoomId] = useState(room);
  const [xIsNext, setXIsNext] = useState();
  const [isNew] = useState(query.get("new"));
  const [player, setPlayer] = useState();
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [mySymbol, setMySymbol] = useState();
  // const socket = useMemo(() => io("https://tictactoesocket.onrender.com/"), []);
  
  const socket = useMemo(() => io("http://localhost:3000" , ), []);
  const navigation = useNavigate();

  const { winner } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square);

  function resetGame() {
    resetGameHandler();
    socket.emit("reset", roomId);
    socket.emit("next turn", { roomId, turn: winner === "X" ? "O" : "X" });
  }

  function resetGameHandler() {
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
      const updatedScores = { ...scores, [winner]: scores[winner] + 1 };
      socket.emit("winner", { roomId, scores: updatedScores });
    }
    setSquares(Array(9).fill(null));
  }

  function handlePlay(nextSquares) {
    //console.log("my Symbol", mySymbol);
    //console.log("Turn", turn);
    if (mySymbol == turn) {
      setSquares(nextSquares);
      //   //console.log("nextSquares", nextSquares);

      // setXIsNext(!xIsNext);

      socket.emit("play", { roomId, nextSquares });

      socket.emit("next turn", { roomId, turn: turn === "X" ? "O" : "X" });
    }
  }

  
  

  useEffect(() => {
    if(roomId === "random" ){
      console.log("random , roomId");
      
       socket.on("my roomId", (roomId) => {
        setRoomId(roomId);  
    });
  }
});

  useEffect(() => {
    // //console.log("useEffect");
    if (roomId === "random") {
      //console.log("random");
      socket.emit("join random", name);
    } else {
      socket.emit("join room", roomId);
      socket.emit("player", { player: name, roomId });
    }
  }, [socket]);

  //console.log("roomId : ", room, roomId);
  

  // useEffect(() => {
  //   if(player && player.length === 2)
  //   location.reload();
  // }, [player])

  useEffect(() => {
    socket.emit("get player", roomId);
  }, [roomId, socket]);

  useEffect(() => {
    socket.on("players", (room) => {
      //console.log(room);
      setPlayer(room);
      const playerSymbol = room?.find(
        (element) => element.player === name
      )?.symbol;
      setMySymbol(playerSymbol);
      setXIsNext(playerSymbol === "X");
    });

    socket.on("next turn", (turn) => {
      //console.log("next turn", turn);
      setTurn(turn);
    });

    socket.on("play", (nextSquares) => {
      //console.log(nextSquares);
      setSquares(nextSquares);
    });

    socket.on("reset", () => {
      resetGameHandler();
    });

    socket.on("winner", (winner) => {
      //console.log("winner", winner);
      setScores(() => winner);
    });

    socket.on("player joined", (msg) => {
      //console.log(msg ," hii");
      setPlayer(msg);

      // socket.emit("get player", roomId);
    });

    socket.on("player exists", (msg) => {
      navigation(-1);
      //console.log(msg);
    });

    return () => {
      socket.off("players");
      socket.off("next turn");
      socket.off("play");
      socket.off("reset");
      socket.off("winner");
      socket.off("player joined");
    };
  }, [socket, name, roomId]);

  return (
    <>
      {/* Mobile-friendly header with responsive layout */}
      <div className="flex flex-wrap absolute w-full justify-between items-center px-4 py-2 sm:px-6">
        <div
          onClick={() => {
            navigator.clipboard.writeText(roomId);
          }}
          className="bg-slate-600 px-3 py-1 rounded-lg m-1 text-sm sm:text-base max-w-fit cursor-pointer "
        >
          Room Id: {roomId}
        </div>
        <div
          onClick={() => {
            socket.disconnect();
            //console.log("clicked");
            navigation(-1);
          }}
          className="bg-slate-600 px-3 py-1 rounded-lg m-1 text-sm sm:text-base max-w-fit"
        >
          Exit
        </div>
      </div>

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
            name={player && player[0] ? player[0].player : "waiting..."}
            symbol={player && player[0]?.symbol}
            avatar={defaultAvatars.X}
            isActive={xIsNext && !winner}
            score={
              player && player[0]?.symbol === "X" ? scores.X : scores.O || 0
            }
            className="w-full md:w-auto"
          />

          <div className="flex flex-col items-center gap-6 sm:gap-8 w-full md:w-auto">
            <GameStatus
              winner={winner}
              xIsNext={turn == "X" ? true : false}
              isDraw={isDraw}
            />
            <GameBoard
              xIsNext={xIsNext}
              squares={squares}
              onPlay={handlePlay}
            />
            <GameControls isDisabled={winner == null || isDraw ? true : false} onReset={resetGame} />
          </div>

          <PlayerProfile
            name={player && player[1] ? player[1].player : "waiting..."}
            symbol={player && player[1]?.symbol}
            avatar={defaultAvatars.O}
            isActive={!xIsNext && !winner}
            score={
              player && player[1]?.symbol === "X" ? scores.X : scores.O || 0
            }
            className="w-full md:w-auto"
          />
        </div>
      </div>
    </>
  );
}
