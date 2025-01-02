import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import env from "dotenv";
env.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    // origin: "*",
    credentials: true,
  },
});

const rooms = {};

// const [roomss , setRooms] = useState({});

io.on("connection", (socket) => {
  // let disconnectTimer
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
    // socket.
    //////console.log("join room", roomId);
    
    socket.join(roomId);

    rooms[roomId] = rooms[roomId] || [];
    //console.log(`User joined room ${roomId}`);
    // socket.broadcast.to(roomId).emit("player joined", "playerJoined");
  });

  socket.on("join random", (player) => {
    //console.log("join random", player , socket.id);

    let roomId = Object.keys(rooms).find(
      (key) => rooms[key].length === 1 && rooms[key][0].isRandom
    );
    if (!roomId) {
      //console.log("creating new room");

      roomId = Math.random().toString(36).substring(7);
      rooms[roomId] = [];
    }
    //console.log("room id", roomId);
    socket.join(roomId);
    // if (
    //   rooms[roomId].find(
    //     (p) => p.player?.toLowerCase() === player?.toLowerCase()
    //   )
    // )
    //   socket.emit("player exists", "username already exists");
    //   // console.log("player exists");
      
    // else 
    {
      rooms[roomId].push({
        player,
        id: socket.id,
        isRandom: true,
        symbol:
          rooms[roomId].length === 0
            ? "X"
            : rooms[roomId].map((p) => (p.symbol === "X" ? "O" : "X"))[0],
      });
      console.log(rooms[roomId]);
      socket.emit("my roomId", roomId);
      socket.broadcast.to(roomId).emit("player joined", rooms[roomId]);
    }
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


console.log(process.env.FRONTEND_URL);


app.use(
  cors({
    // origin:  process.env.FRONTEND_URL,
    origin: "*",
    credentials: true,
  })
);

// console.log(typeof(process.env.FRONTEND_URL));


app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  res.send(
    rooms[roomId] ? rooms[roomId].map((p) => p.player) : "Room not found"
  );
});

app.get("/loop", (req, res) => {
  res.send("Server is running");
});

// app.use((req, res, next) => {
//   if (req.path === "/loop") {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   }
//   next();
// });

server.listen(process.env.PORT , () => {
  console.log("Server is running on port", process.env.PORT);
});
