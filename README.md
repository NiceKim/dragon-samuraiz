# [🎮 PLAY IT HERE](http://dragon-samurai-z-env.eba-bdb4qx2n.ap-southeast-1.elasticbeanstalk.com/)

# 🐉 Dragon SamuraiZ - Rock Paper Scissors Game

A real-time Rock Paper Scissors game built with React, Tailwind CSS, Node.js (Express), and Socket.IO.

## 🎮 Game Features

- **Real-time Matching**: Play with others instantly via Socket.IO
- **Responsive UI**: Modern design with Tailwind CSS
- **Timeout System**: Lose automatically if you don't choose within 10 seconds
- **Random Nickname**: Auto-generated nickname if left blank

## 🏗️ Project Structure

```
Dragon SamuraiZ/
├── client/                 # React client
│   ├── build/              # React build output
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Express + Socket.IO server
│   ├── server.js          # Main server file
│   └── package.json       # Start script only
└── package.json           # Root package.json (dependency management)
```

## 🚀 Local Development

### Requirements
- Node.js 18.0.0 or higher
- npm

### Installation & Run

1. **Install dependencies (separately)**:
```bash
npm install          # Root dependencies
cd client && npm install  # Client dependencies
cd ../server && npm install  # Server dependencies
```

2. **Run development servers**:
```bash
# Use two terminals or run separately.
cd server && npm start   # Express server (port 3001)
cd client && npm start   # React dev server (port 3000)
```

## 🌐 AWS Elastic Beanstalk Deployment

### Preparation

1. **Install & configure AWS CLI**
2. **Install EB CLI**:
```bash
npm install -g aws-elasticbeanstalk-cli
```

### Build & Deploy

1. **Build React app**
```bash
npm run build
```

2. **EB initialize & deploy**
```bash
eb init
eb create dragon-samurai-rps-env
eb deploy
```

### After Deployment

Once deployed, access the game via the URL provided by EB.

**Environment Variables**: The app works with default values. If needed, set environment variables via EB settings.

## 🔧 Tech Stack

### Frontend
- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Socket.IO Client**: Real-time communication

### Backend
- **Node.js**: Runtime
- **Express**: Web server framework
- **Socket.IO**: Real-time communication
- **CORS**: Cross-Origin Resource Sharing

## 🎯 How to Play

### 1. Home Screen
- Enter nickname (optional)
- Click "Start Game"

### 2. Matching
- Wait while searching for an opponent
- Automatically moves to game screen when matched

### 3. Game Screen
- Modern game interface built with React
- Choose your card (Rock/Paper/Scissors)
- 10-second timer
- See opponent's selection status

### 4. Result Screen
- Shows win/lose/draw result
- See both players' choices
- "Rematch" or "Go Home" options

## 🎯 Game Rules

- Standard Rock Paper Scissors rules
- 10-second time limit
- Automatic matching system
- Real-time result transmission

## 🔄 Development Workflow

1. Develop and test locally
2. Commit to Git
3. Deploy with EB CLI
4. Test in production

## 🐛 Troubleshooting

### Port Conflict
- On EB, always use `process.env.PORT` (required for EB)
- Default ports: 8080 (EB), 3001 (local)

### Check EB Logs
```bash
eb logs
```

### Build Errors
1. **CSS Syntax Error**
   ```bash
   # Clear cache
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 📞 Support

If you encounter issues or have suggestions, please open an issue.

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Enjoy the game! 🎮** 