export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export type GameMode = 'ai' | 'pvp';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'title' | 'playing' | 'won' | 'draw';

export interface WinInfo {
  winner: Player;
  combination: [number, number, number];
  orientation: 'row-0' | 'row-1' | 'row-2' | 'col-0' | 'col-1' | 'col-2' | 'diag-main' | 'diag-anti';
}

export interface ScoreBoard {
  xWins: number;
  oWins: number;
  draws: number;
  streak: number;
  streakHolder: Player | null;
  totalGames: number;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: AIDifficulty;
  humanPlayer: Player; // which symbol the human plays in AI mode
  showKeyHints: boolean;
  soundEnabled: boolean;
}
