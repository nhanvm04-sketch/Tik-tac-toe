import { BoardState, Player, WinInfo, AIDifficulty } from '../types';

export const WIN_PATTERNS: Array<{
  combo: [number, number, number];
  orientation: WinInfo['orientation'];
}> = [
  // Rows
  { combo: [0, 1, 2], orientation: 'row-0' },
  { combo: [3, 4, 5], orientation: 'row-1' },
  { combo: [6, 7, 8], orientation: 'row-2' },
  // Columns
  { combo: [0, 3, 6], orientation: 'col-0' },
  { combo: [1, 4, 7], orientation: 'col-1' },
  { combo: [2, 5, 8], orientation: 'col-2' },
  // Diagonals
  { combo: [0, 4, 8], orientation: 'diag-main' },
  { combo: [2, 4, 6], orientation: 'diag-anti' },
];

/**
 * Checks if the board currently has a 3-in-a-row winner
 */
export function checkWin(board: BoardState): WinInfo | null {
  for (const { combo, orientation } of WIN_PATTERNS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        combination: combo,
        orientation,
      };
    }
  }
  return null;
}

/**
 * Checks if all cells are filled
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Returns array of indices of empty cells
 */
export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Minimax algorithm with depth penalty for optimal moves
 */
function minimax(
  currentBoard: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): { score: number; move?: number } {
  const win = checkWin(currentBoard);
  if (win) {
    if (win.winner === aiPlayer) {
      return { score: 10 - depth };
    } else {
      return { score: depth - 10 };
    }
  }

  const available = getAvailableMoves(currentBoard);
  if (available.length === 0) {
    return { score: 0 };
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = available[0];

    for (const move of available) {
      currentBoard[move] = aiPlayer;
      const result = minimax(currentBoard, depth + 1, false, aiPlayer, humanPlayer);
      currentBoard[move] = null;

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = available[0];

    for (const move of available) {
      currentBoard[move] = humanPlayer;
      const result = minimax(currentBoard, depth + 1, true, aiPlayer, humanPlayer);
      currentBoard[move] = null;

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Computes AI move based on selected difficulty
 */
export function getAIMove(
  board: BoardState,
  aiPlayer: Player,
  difficulty: AIDifficulty
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const available = getAvailableMoves(board);

  if (available.length === 0) return -1;
  if (available.length === 9) {
    // Opening move: pick center or corners for flavor
    const openings = [0, 2, 4, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  // 1. Easy: 70% random, 30% take immediate win if present
  if (difficulty === 'easy') {
    // Check if AI can win immediately
    for (const move of available) {
      board[move] = aiPlayer;
      const win = checkWin(board);
      board[move] = null;
      if (win && Math.random() < 0.5) return move;
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  // 2. Medium: Always take immediate win; always block human win; else 60% minimax, 40% random
  if (difficulty === 'medium') {
    // Immediate win
    for (const move of available) {
      board[move] = aiPlayer;
      const win = checkWin(board);
      board[move] = null;
      if (win) return move;
    }
    // Block opponent
    for (const move of available) {
      board[move] = humanPlayer;
      const win = checkWin(board);
      board[move] = null;
      if (win) return move;
    }

    if (Math.random() < 0.6) {
      const result = minimax(board, 0, true, aiPlayer, humanPlayer);
      return result.move !== undefined ? result.move : available[0];
    } else {
      return available[Math.floor(Math.random() * available.length)];
    }
  }

  // 3. Hard / Unbeatable: Full minimax optimal play
  const result = minimax(board, 0, true, aiPlayer, humanPlayer);
  return result.move !== undefined ? result.move : available[0];
}
