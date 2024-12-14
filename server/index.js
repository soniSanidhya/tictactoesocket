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

const rooms = {};

// const [roomss , setRooms] = useState({});

io.on("connection", (socket) => {
  //////console.log("user joined", socket.id);

  socket.on("disconnect", () => {
    ////console.log("User disconnected", socket.id);
    let targetRoomId = null;
    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId] = rooms[roomId].filter((p) => {
        if (p.id === socket.id) {
          targetRoomId = roomId;
        }
        return p.id !== socket.id;
      });

      //console.log("targeted room", rooms[targetRoomId]);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        //console.log(`Room ${roomId} deleted`);
      }
    });

    if (targetRoomId) {
      ////console.log("targeted room", rooms[targetRoomId]);
      socket.broadcast
        .to(targetRoomId)
        .emit("player joined", rooms[targetRoomId]);
    }
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    // socket.
    rooms[roomId] = rooms[roomId] || [];
    //console.log(`User joined room ${roomId}`);
    // socket.broadcast.to(roomId).emit("player joined", "playerJoined");
  });

  socket.on("join random", (player) => {
    let roomId = Object.keys(rooms).find(
      (key) => rooms[key].length === 1 && rooms[key][0].isRandom
    );
    if (!roomId) {
      roomId = Math.random().toString(36).substring(7);
      rooms[roomId] = [];
    }
    rooms[roomId].push({
      player,
      id: socket.id,
      isRandom: true,
      symbol: rooms[roomId].length === 1 ? "X" : "O",
    });
    socket.join(roomId);
    socket.emit("joined room", roomId);
  });

  socket.on("player", ({ player, roomId }) => {
    if (rooms[roomId]?.length < 2) {
      if (
        rooms[roomId].find(
          (p) => p.player?.toLowerCase() === player?.toLowerCase()
        )
      )
        socket.emit("player exists", "username already exists");
      else {
        rooms[roomId].push({
          player,
          id: socket.id,
          isRandom: false,
          symbol:
            rooms[roomId].length === 0
              ? "X"
              : rooms[roomId].map((p) => (p.symbol === "X" ? "O" : "X"))[0],
        });
        //console.log(rooms[roomId]);
        socket.broadcast.to(roomId).emit("player joined", rooms[roomId]);
      }
    } else socket.emit("room full");

    // socket.emit("players", rooms[roomId]);
    // socket.to(roomId).emit("players", rooms[roomId]);
  });

  socket.on("get player", (roomId) => {
    //console.log("request for player", roomId);
    if (rooms[roomId]) {
      // console.log("players", rooms[roomId]);

      socket.emit("players", rooms[roomId]);
    } else {
      socket.emit("room not found");
    }
  });

  socket.on("next turn", ({ roomId, turn }) => {
    //console.log("next turn", turn);

    io.in(roomId).emit("next turn", turn);
  });

  socket.on("play", ({ roomId, nextSquares }) => {
    //console.log(nextSquares);

    io.to(roomId).emit("play", nextSquares);
  });

  socket.on("reset", (roomId) => {
    io.in(roomId).emit("reset");
  });

  socket.on("winner", ({ roomId, scores }) => {
    //console.log("winner", scores);
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
  //console.log("Server is running on port 3000");
});
