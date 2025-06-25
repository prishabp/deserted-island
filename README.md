# 🏝️ Deserted Island

**Deserted Island** is a single-player, MERN-stack text-based adventure game where players explore mysterious rooms affected by time dilation. Interact with the world using commands, solve puzzles, and navigate different timelines to uncover the secrets of the island.

---

## 🚀 Features

- 🧭 Command-based gameplay
- 🕰️ Time dilation across rooms (past, present, future)
- 🎒 Inventory system
- 🤖 Unique NPCs and interactions
- 🧩 Puzzle solving and level progression

---

## 🛠 Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/prishabp/deserted-island.git
cd deserted-island
```

### 2. Install Dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd ../client
npm install
```

### 3. Setup Environment Variables

Create a `.env` file inside the `server/` directory with your MongoDB URI:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/deserted-island
JWT_SECRET=your-secret
```

### 4. Run MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```

### 5. Start the App

#### Backend:
```bash
cd server
npm run dev
```

#### Frontend:
```bash
cd ../client
npm start
```

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit and push (`git commit -m "Add feature" && git push`)
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
