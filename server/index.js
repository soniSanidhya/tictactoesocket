import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// io.on('connection', (socket) => {
//     socket.on('join room' , (roomId) => {
//         socket.join(roomId);
//         console.log(`User joined room ${roomId}`);
//         socket.to(roomId).emit("player joined" , "playerJoined");
//     }),
//     socket.on('disconnect', () => {
//         console.log("User disconnected");
//     })
//     socket.on('isMyTurn', ({roomId, isMyTurn}) => {
//         console.log(isMyTurn);

//         io.to(roomId).emit('isMyTurn', !isMyTurn);
//     })

//     socket.on('xIsNext', ({roomId, xIsNext}) => {
//         io.to(roomId).emit('xIsNext', xIsNext);
//     })

//     socket.on('play', ({roomId, nextSquares}) => {
//         console.log(nextSquares);

//         io.to(roomId).emit('play', nextSquares);
//     })
//     socket.on('reset', (roomId) => {
//         io.to(roomId).emit('reset');
//     })
//     socket.on('winner', (roomId, winner) => {
//         io.to(roomId).emit('winner', winner);
//     })
//     socket.on('draw', (roomId) => {
//         io.to(roomId).emit('draw');
//     })
//     socket.on('leave room', (roomId) => {
//         socket.leave(roomId);
//         console.log(`User left room ${roomId}`);
//     })
//     socket.on('player1' , ({roomId , player}) => {
//         console.log(player);
//         console.log(roomId);
//         io.to(roomId).emit('player1', player);
//     })
//     socket.on('player2' , ({roomId , player}) => {
//         console.log(player);
//         console.log(roomId);
//         io.to(roomId).emit('player2', player);
//     })
// })

const rooms = {};

// setInterval(() => {
//     console.log(rooms);
// }, 5000);

io.on("connection", (socket) => {
  console.log("user joined", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted`);
      }
    });
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || [];
    console.log(`User joined room ${roomId}`);
    socket.to(roomId).emit("player joined", "playerJoined");
  });

  socket.on("player", ({ player, roomId }) => {
    if (rooms[roomId]?.length < 2) {
      if (rooms[roomId].find((p) => p.player?.toLowerCase() === player?.toLowerCase()))
        socket.emit("player exists", "username already exists");
      else rooms[roomId].push({ player, id: socket.id , symbol : rooms[roomId].length === 0 ? "X" : rooms[roomId].map(p => p.symbol === "X" ? "O" : "X")[0]});
    } else socket.emit("room full");
    console.log(rooms);
    // socket.emit("players", rooms[roomId]);
    // socket.to(roomId).emit("players", rooms[roomId]);
  });

  socket.on("get player", (roomId) => {
    console.log("request for player", roomId); 
    if (rooms[roomId]) {
        console.log("players", rooms[roomId]);
        
      socket.emit("players", rooms[roomId]);
    } else {
      socket.emit("room not found");
    }
  });

  socket.on("next turn", ({ roomId, turn }) => {
    console.log("next turn", turn);
    
    io.in(roomId).emit("next turn", turn);
  });

  socket.on("play", ({ roomId, nextSquares }) => {
    console.log(nextSquares);

    io.to(roomId).emit("play", nextSquares);
  });

    socket.on("reset", (roomId) => {
        io.in(roomId).emit("reset");
    });

    socket.on("winner", ({roomId, scores}) => {
        console.log("winner", scores);
        io.in(roomId).emit("winner", scores);
    });

});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  res.send(
    rooms[roomId] ? rooms[roomId].map((p) => p.player) : "Room not found"
  );
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
