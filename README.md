# 🎮 Tic Tac Toe Socket

A modern, real-time multiplayer Tic Tac Toe game built with React and Node.js. Play with friends online or get matched with random players in this classic game with a contemporary twist!

## ✨ Features

- 🌐 **Real-time Multiplayer**: Play with friends or strangers in real-time using Socket.IO
- 🎲 **Random Matchmaking**: Get automatically matched with other players looking for a game
- 🏠 **Private Rooms**: Create custom rooms with room IDs to play with specific friends
- 🤖 **Bot Mode**: Play against AI when no human players are available
- 📱 **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful animations and gradients using Tailwind CSS and Framer Motion
- 📊 **Score Tracking**: Keep track of wins and losses during your gaming session
- 🔗 **Easy Sharing**: Share room IDs with friends to invite them to your game

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Socket.IO Client** - Real-time communication
- **React Router DOM** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soniSanidhya/tictactoesocket.git
   cd tictactoesocket
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
LOOPBACK_URL=https://your-loop-url.com
```

**Environment Variables Explained:**
- `PORT`: Port number for the server (default: 4000)
- `FRONTEND_URL`: URL of your frontend application for CORS
- `LOOPBACK_URL`: URL for health checks (used by the Loop component)

### Running Locally

1. **Start the server**
   ```bash
   cd server
   npm run dev
   # or npm start for production
   ```

2. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## 🎯 How to Play

1. **Enter Your Name**: Start by entering your preferred username
2. **Choose Game Mode**:
   - **Create/Join Room**: Enter a room ID to join a specific room, or leave empty to create a new one
   - **Join Random**: Get matched with another player looking for a game
   - **Play with Bot**: Challenge the AI for solo practice
3. **Share Room ID**: Copy and share your room ID with friends to invite them
4. **Play**: Take turns placing X's and O's on the 3×3 grid
5. **Win**: Get three in a row (horizontal, vertical, or diagonal) to win!

## 📁 Project Structure

```
tictactoesocket/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── utils/          # Utility functions and game logic
│   │   ├── App.jsx         # Main game component
│   │   ├── Room.jsx        # Room selection component
│   │   └── Bot.jsx         # Bot game component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                  # Node.js backend server
│   ├── index.js            # Main server file
│   ├── package.json        # Server dependencies
│   └── vercel.json         # Vercel deployment config
├── Loop/                    # Health check component
│   └── index.html          # Simple health check page
└── README.md               # Project documentation
```

## 🌐 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Deploy automatically on push to main branch

### Backend (Render/Railway/Heroku)
The backend can be deployed to any Node.js hosting service:
1. Set environment variables on your hosting platform
2. Use `npm start` as the start command
3. Ensure the PORT environment variable is set correctly

### Environment Setup for Production
Update the Socket.IO connection URL in `frontend/src/App.jsx`:
```javascript
const socket = useMemo(() => io("YOUR_PRODUCTION_SERVER_URL"), []);
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Server:**
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

### Key Components

- **GameBoard**: Renders the 3×3 tic-tac-toe grid
- **GameStatus**: Shows current game state and turn information
- **GameControls**: Reset game and other game controls
- **PlayerProfile**: Displays player information and scores
- **Room Management**: Handles room creation, joining, and player synchronization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sanidhya Soni**
- GitHub: [@soniSanidhya](https://github.com/soniSanidhya)

## 🐛 Bug Reports & Feature Requests

If you encounter any bugs or have suggestions for new features, please create an issue on GitHub with detailed information.

---

**Note**: Screenshots and live demo links would make this README even more engaging! If you'd like me to add screenshots or need help with any specific section, please let me know.