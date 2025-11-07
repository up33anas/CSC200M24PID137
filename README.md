# ♠ The Pseudo Solitaire

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)

> A modern, interactive web-based implementation of the classic Klondike Solitaire card game built with React.js following MVVM architecture, undo/redo functionality, and custom data structure implementations.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Data Structures Implemented](#data-structures-implemented)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Game Mechanics](#game-mechanics)
- [Implementation Details](#implementation-details)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About the Project

The Pseudo Solitaire is a fully functional, browser-based implementation of the classic Klondike Solitaire game developed as part of the CSC200 Data Structures & Algorithms mid-term project. This project demonstrates practical applications of core data structures including **Stack**, **Queue**, and **List** implementations, along with domain-driven design principles.

### Project Objectives

- ✅ Implement Klondike Solitaire following standard game rules
- ✅ Build custom data structures from scratch (Stack, Queue, List)
- ✅ Apply MVVM (Model-View-ViewModel) architectural pattern
- ✅ Create an intuitive and responsive user interface
- ✅ Implement game state management with undo/redo functionality
- ✅ Develop efficient card movement validation algorithms

---

## ✨ Features

### Core Gameplay

- ✅ **Complete Klondike Rules**

  - Seven-column tableau with proper card dealing
  - Four foundation piles (Ace to King by suit)
  - Stock and waste pile mechanics
  - Draw-three cards functionality

- ✅ **Interactive Controls**
  - Drag-and-drop card movements
  - Execute valid moves
  - Card flipping

### Advanced Features

- 🔄 **Undo/Redo System**

  - Unlimited move history
  - Stack-based state management
  - Restore previous game states

- 💡 **Hint System**

  - AI-powered move suggestions
  - Helps players when stuck
  - Highlights valid moves

- ⏱️ **Game Statistics**

  - Real-time timer
  - Move counter
  - Progress percentage
  - Score tracking

- 🎨 **Modern UI/UX**
  - Responsive design (desktop & mobile)
  - Smooth animations
  - Professional interface
  - Multiple page navigation

---

## 🏗️ Architecture

This project follows the **MVVM (Model-View-ViewModel)** architectural pattern for clean separation of concerns:

```
┌─────────────────────────────────────────┐
│              Views (UI)                 │
│   HomePage, BoardView, RulesPage, etc.  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│           ViewModels                    │
│   GameViewModel (State Management)      │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│           Controllers                   │
│   GameController (Business Logic)       │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│             Models                      │
│  Domain Objects & Data Structures       │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

**Views (`src/views/`)**

- React components for UI rendering
- User interaction handling
- Visual presentation

**ViewModels (`src/viewModels/`)**

- State management
- Data binding between Views and Controllers
- UI state logic

**Controllers (`src/controllers/`)**

- Game business logic
- Move validation
- Game flow control

**Models (`src/models/`)**

- Domain objects (Card, Deck, Foundation, etc.)
- Custom data structures (Stack, Queue, List)
- Core game entities

---

## 🗂️ Data Structures Implemented

### 1. **Stack (LIFO - Last In First Out)**

**File:** `src/models/data structures/Stack.js`

**Purpose:**

- Tableau columns management
- Foundation piles
- Undo/Redo history tracking

**Implementation:**

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    /* ... */
  }
  pop() {
    /* ... */
  }
  peek() {
    /* ... */
  }
  isEmpty() {
    /* ... */
  }
  size() {
    /* ... */
  }
}
```

**Operations:**

- `push(element)` - O(1)
- `pop()` - O(1)
- `peek()` - O(1)
- `isEmpty()` - O(1)

**Usage in Project:**

- Foundation piles use stacks to build suits from Ace to King
- Undo/Redo functionality uses stacks to track game states

---

### 2. **Queue (FIFO - First In First Out)**

**File:** `src/models/data structures/Queue.js`

**Purpose:**

- Stock pile management
- Card drawing mechanism
- Waste pile recycling

**Implementation:**

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    /* ... */
  }
  dequeue() {
    /* ... */
  }
  front() {
    /* ... */
  }
  isEmpty() {
    /* ... */
  }
  size() {
    /* ... */
  }
}
```

**Operations:**

- `enqueue(element)` - O(1)
- `dequeue()` - O(1)
- `front()` - O(1)
- `isEmpty()` - O(1)

**Usage in Project:**

- Stock pile and waste pile use queue for proper card draw order
- Ensures cards are drawn in sequence
- Handles waste pile recycling when stock is empty

---

### 3. **List (Custom Implementation)**

**File:** `src/models/data structures/List.js`

**Purpose:**

- Dynamic card storage
- Deck management
- Flexible card manipulation

**Implementation:**

```javascript
class List {
  constructor() {
    this.items = [];
  }

  add(element) {
    /* ... */
  }
  remove(index) {
    /* ... */
  }
  get(index) {
    /* ... */
  }
  size() {
    /* ... */
  }
  clear() {
    /* ... */
  }
  // Additional methods...
}
```

**Operations:**

- `add(element)` - O(1)
- `remove(index)` - O(n)
- `get(index)` - O(1)
- `shuffle()` - O(n)

**Usage in Project:**

- Initial deck of 52 cards
- Card shuffling (Fisher-Yates algorithm)
- Dynamic card collection management
- Tableau columns use lists for face-up and face-down cards

---

## 🛠️ Technologies

### Frontend Framework

- **React.js (19.2.0)** - Component-based UI framework
- **JSX** - JavaScript XML for component templates

### Build Tools

- **Vite (7.1.7)** - Fast build tool and dev server
- **ESLint (9.36.0)** - Code quality and linting

### Styling

- **Tailwind CSS** - Custom styling

### Development Tools

- **Git/GitLab** - Version control
- **Node.js & npm** - Package management
- **VS Code** - Development environment

### Deployment

- **Vercel**

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git** (for cloning)

Check versions:

```bash
node --version
npm --version
git --version
```

---

### Installation

1. **Clone the repository**

```bash
git clone https://gitlab.com/your-username/CSC200M24PID137.git
cd CSC200M24PID137
```

2. **Install dependencies**

```bash
npm install
```

This will install all required packages listed in `package.json`.

3. **Verify installation**

```bash
npm list
```

---

### Running the Application

#### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

#### Production Build

Create an optimized production build:

```bash
npm run build
```

Build files will be generated in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

#### Code Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 📁 Project Structure

```
CSC200M24PID137/
├── .git/                       # Git version control
├── node_modules/               # Dependencies
├── src/
│   ├── controllers/
│   │   └── GameController.js   # Game business logic (10,796 bytes)
│   ├── models/
│   │   ├── data structures/
│   │   │   ├── List.js         # Custom List implementation (4,191 bytes)
│   │   │   ├── Queue.js        # FIFO Queue (2,001 bytes)
│   │   │   └── Stack.js        # LIFO Stack (1,607 bytes)
│   │   └── domain/
│   │       ├── Card.js         # Card entity (410 bytes)
│   │       ├── Deck.js         # Deck management (1,255 bytes)
│   │       ├── Foundation.js   # Foundation pile (649 bytes)
│   │       ├── Stock.js        # Stock pile (2,072 bytes)
│   │       ├── Tableau.js      # Tableau column (891 bytes)
│   │       └── Waste.js        # Waste pile (1,242 bytes)
│   ├── styles/
│   │   ├── App.css            # App component styles
│   │   └── index.css          # Global styles
│   ├── utils/
│   │   ├── gameRules.js       # Game rules validation (2,363 bytes)
│   │   ├── moveHelpers.js     # Move helper functions (6,929 bytes)
│   │   └── structureUtils.js  # Utility functions (1,005 bytes)
│   ├── viewModels/
│   │   ├── GameViewModel.js   # Main view model (6,760 bytes)
│   │   └── backup.js          # Backup/restore logic (5,891 bytes)
│   ├── views/
│   │   ├── BoardView.jsx      # Main game board (4,423 bytes)
│   │   ├── CardUI.jsx         # Card component (1,704 bytes)
│   │   ├── Foundation.jsx     # Foundation view (1,960 bytes)
│   │   ├── Header.jsx         # Header component (2,183 bytes)
│   │   ├── HomePage.jsx       # Landing page (3,636 bytes)
│   │   ├── LeavePage.jsx      # Exit page (2,511 bytes)
│   │   ├── RulesPage.jsx      # Rules display (10,237 bytes)
│   │   ├── Sidebar.jsx        # Game sidebar (7,073 bytes)
│   │   ├── Stock.jsx          # Stock pile view (1,317 bytes)
│   │   ├── Tableau.jsx        # Tableau view (2,281 bytes)
│   │   └── Waste.jsx          # Waste pile view (1,924 bytes)
│   ├── App.jsx                # Root component (1,341 bytes)
│   └── main.jsx               # Entry point (418 bytes)
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point (1,182 bytes)
├── package.json               # Dependencies
├── package-lock.json          # Locked dependencies
├── README.md                  # This file
└── vite.config.js             # Vite configuration
```

**Total Project Size:**

- **Lines of Code:** ~3,000+
- **Files:** 30+
- **Components:** 11 Views
- **Custom Data Structures:** 3

---

## 🎮 Game Mechanics

### Initialization Process

1. **Deck Creation**

   - `Deck.js` creates 52 cards (4 suits × 13 ranks)
   - Each card has suit, rank, and faceUp properties

2. **Shuffling Algorithm**

   - Fisher-Yates shuffle in `List.js`
   - Time complexity: O(n)
   - Ensures random distribution

3. **Card Dealing**
   - Distribute to 7 tableau columns (1-7 cards)
   - Top card face-up, others face-down
   - Remaining 24 cards to stock pile

### Move Validation

**File:** `src/utils/gameRules.js`

```javascript
// Tableau move validation
export function canPlaceOnDestination(movingCard, destCard) {
  if (!destCard) {
    console.log("inside canPlaceOnDestination:", movingCard, destCard);
    return movingCard.rank === "K"; // Only King can be placed on empty spot
  }
  console.log("inside canPlaceOnDestination:", movingCard, destCard);

  console.log("rankValue(movingCard.rank):", rankValue(movingCard.rank));
  console.log("rankValue(destCard.rank):", rankValue(destCard.rank));
  console.log(
    "color and rank comparison:",
    rankValue(movingCard.rank) === rankValue(destCard.rank) - 1 &&
      !isSameColor(movingCard.suit, destCard.suit)
  );
  return (
    rankValue(movingCard.rank) === rankValue(destCard.rank) - 1 &&
    !isSameColor(movingCard.suit, destCard.suit)
  );
}

// Checks if a sequence of cards is valid for tableau movement
export function isValidSequence(cards) {
  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];

    if (rankValue(current.rank) !== rankValue(next.rank) + 1) return false;
    if (isSameColor(current.suit, next.suit)) return false;
  }
  return true;
}
```

### Undo/Redo System

**File:** `src/viewModels/backup.js`

- Uses two stacks: `undoStack` and `redoStack`
- Each move pushes complete game state
- Undo: Pop from `undoStack`, push to `redoStack`
- Redo: Pop from `redoStack`, push to `undoStack`

---

## 🧪 Testing

### Manual Test Cases

#### Test Case 1: Game Initialization

- **Input:** Start new game
- **Expected:** 7 tableau columns, 24 stock cards, 4 empty foundations
- **Result:** ✅ Pass

#### Test Case 2: Valid Tableau Move

- **Input:** Red 6 on Black 7
- **Expected:** Card moves successfully
- **Result:** ✅ Pass

#### Test Case 3: Invalid Color Move

- **Input:** Red 6 on Red 7
- **Expected:** Move rejected
- **Result:** ✅ Pass

#### Test Case 4: Foundation Building

- **Input:** Place Ace, then 2, then 3 of same suit
- **Expected:** Cards stack in foundation
- **Result:** ✅ Pass

#### Test Case 5: Undo Functionality

- **Input:** Make 5 moves, undo 3 times
- **Expected:** Game state restored correctly
- **Result:** ✅ Pass

#### Test Case 6: Redo Functionality

- **Input:** Undo 2 moves, redo 2 moves
- **Expected:** Moves reapplied correctly
- **Result:** ✅ Pass

#### Test Case 7: Stock Pile Draw

- **Input:** Draw 3 cards from stock
- **Expected:** 3 cards appear in waste
- **Result:** ✅ Pass

#### Test Case 8: Win Condition

- **Input:** Move all cards to foundation
- **Expected:** Win screen displayed
- **Result:** ✅ Pass

#### Test Case 9: Hint System

- **Input:** Request hint
- **Expected:** Valid move suggested
- **Result:** ✅ Pass

#### Test Case 10: Empty Column

- **Input:** Move King to empty column
- **Expected:** King placed successfully
- **Result:** ✅ Pass

---

## 📧 Contact

**Anas Sabir**
Email: 2024cs137@student.uet.edu.pk
GitLab: [@anassabir](https://gitlab.com/anassabir)

**Project Repository:**
[https://gitlab.com/anassabir/CSC200M24PID137](https://gitlab.com/anassabir/CSC200M24PID137)

---

## 🙏 Acknowledgments

- **React Documentation** - Comprehensive framework documentation
- **Solitaired.com** - Game rules reference
- **MDN Web Docs** - JavaScript reference
- **Tailwind Docs** - Tailwind CSS reference

---

## 📊 Project Statistics

- **Total Lines of Code:** 2,500+
- **Components/Views:** 11
- **Domain Models:** 6
- **Custom Data Structures:** 3 (Stack, Queue, List)
- **Helper Functions:** 20+
- **Development Time:** 2 weeks
- **Git Commits:** 25+

---

<div align="center">

**Made with ❤️ by Anas Sabir**

</div>
