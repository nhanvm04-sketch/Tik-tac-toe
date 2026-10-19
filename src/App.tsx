import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardState,
  Player,
  GameMode,
  AIDifficulty,
  GameStatus,
  WinInfo,
  ScoreBoard,
  GameSettings,
} from './types';
import { checkWin, isBoardFull, getAIMove } from './utils/ai';
import { sound } from './utils/audio';
import { TitleScreen } from './components/TitleScreen';
import { GameBoard } from './components/GameBoard';
import { GameScoreboard } from './components/GameScoreboard';
import { VictoryModal } from './components/VictoryModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'ai',
  difficulty: 'medium',
  humanPlayer: 'X',
  showKeyHints: true,
  soundEnabled: !sound.getMuted(),
};

const INITIAL_SCORES: ScoreBoard = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  streak: 0,
  streakHolder: null,
  totalGames: 0,
};

export default function App() {
  const [status, setStatus] = useState<GameStatus>('title');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>('X');
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [history, setHistory] = useState<BoardState[]>([]);
  const [scores, setScores] = useState<ScoreBoard>(INITIAL_SCORES);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Timer ref for AI moves to prevent dangling timeouts
  const aiTimeoutRef = useRef<number | null>(null);

  // Sync audio mute state whenever settings change
  const handleToggleSound = useCallback(() => {
    const isMuted = sound.toggleMute();
    setSettings((prev) => ({ ...prev, soundEnabled: !isMuted }));
  }, []);

  /**
   * Reset the current round board
   */
  const handleResetRound = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    setBoard(INITIAL_BOARD);
    setTurn('X');
    setWinInfo(null);
    setHistory([]);
    setIsAiThinking(false);
    setConfettiActive(false);
    setStatus('playing');
    sound.playClick();

    // If AI mode and Human is O, AI starts as X!
    if (settings.mode === 'ai' && settings.humanPlayer === 'O') {
      setIsAiThinking(true);
      aiTimeoutRef.current = window.setTimeout(() => {
        const aiMove = getAIMove(INITIAL_BOARD, 'X', settings.difficulty);
        if (aiMove !== -1) {
          const newBoard = [...INITIAL_BOARD];
          newBoard[aiMove] = 'X';
          setBoard(newBoard);
          setHistory([INITIAL_BOARD]);
          sound.playXPlace();
          setTurn('O');
        }
        setIsAiThinking(false);
      }, 400);
    }
  }, [settings.mode, settings.humanPlayer, settings.difficulty]);

  /**
   * Start fresh game from Title Screen
   */
  const handleStartGame = useCallback(() => {
    sound.playStart();
    handleResetRound();
  }, [handleResetRound]);

  /**
   * Return to Title / Menu Screen
   */
  const handleBackToMenu = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    sound.playClick();
    setConfettiActive(false);
    setStatus('title');
  }, []);

  /**
   * Handle Cell Click / Placement
   */
  const handleCellClick = useCallback(
    (index: number) => {
      if (status !== 'playing' || board[index] !== null || isAiThinking) {
        return;
      }

      // Record history for undo
      setHistory((prev) => [...prev, [...board]]);

      const newBoard = [...board];
      newBoard[index] = turn;
      setBoard(newBoard);

      // Sound feedback based on player
      if (turn === 'X') {
        sound.playXPlace();
      } else {
        sound.playOPlace();
      }

      // Check win condition
      const win = checkWin(newBoard);
      if (win) {
        setWinInfo(win);
        setStatus('won');
        sound.playWin();
        setConfettiActive(true);

        setScores((prev) => {
          const isX = win.winner === 'X';
          const newStreak = prev.streakHolder === win.winner ? prev.streak + 1 : 1;
          return {
            ...prev,
            xWins: isX ? prev.xWins + 1 : prev.xWins,
            oWins: !isX ? prev.oWins + 1 : prev.oWins,
            streak: newStreak,
            streakHolder: win.winner,
            totalGames: prev.totalGames + 1,
          };
        });
        return;
      }

      // Check draw
      if (isBoardFull(newBoard)) {
        setStatus('draw');
        sound.playDraw();
        setScores((prev) => ({
          ...prev,
          draws: prev.draws + 1,
          streak: 0,
          streakHolder: null,
          totalGames: prev.totalGames + 1,
        }));
        return;
      }

      // Next turn
      const nextTurn: Player = turn === 'X' ? 'O' : 'X';
      setTurn(nextTurn);

      // AI Response Turn
      if (settings.mode === 'ai' && nextTurn !== settings.humanPlayer) {
        setIsAiThinking(true);
        aiTimeoutRef.current = window.setTimeout(() => {
          const aiMove = getAIMove(newBoard, nextTurn, settings.difficulty);
          if (aiMove !== -1) {
            const aiBoard = [...newBoard];
            aiBoard[aiMove] = nextTurn;
            setBoard(aiBoard);

            if (nextTurn === 'X') {
              sound.playXPlace();
            } else {
              sound.playOPlace();
            }

            const aiWin = checkWin(aiBoard);
            if (aiWin) {
              setWinInfo(aiWin);
              setStatus('won');
              sound.playWin();
              setScores((prev) => {
                const isX = aiWin.winner === 'X';
                const newStreak = prev.streakHolder === aiWin.winner ? prev.streak + 1 : 1;
                return {
                  ...prev,
                  xWins: isX ? prev.xWins + 1 : prev.xWins,
                  oWins: !isX ? prev.oWins + 1 : prev.oWins,
                  streak: newStreak,
                  streakHolder: aiWin.winner,
                  totalGames: prev.totalGames + 1,
                };
              });
            } else if (isBoardFull(aiBoard)) {
              setStatus('draw');
              sound.playDraw();
              setScores((prev) => ({
                ...prev,
                draws: prev.draws + 1,
                streak: 0,
                streakHolder: null,
                totalGames: prev.totalGames + 1,
              }));
            } else {
              setTurn(settings.humanPlayer);
            }
          }
          setIsAiThinking(false);
        }, 400); // 400ms organic thinking duration
      }
    },
    [status, board, turn, isAiThinking, settings]
  );

  /**
   * Undo last move
   */
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isAiThinking || status !== 'playing') return;

    sound.playClick();
    if (settings.mode === 'ai') {
      // In AI mode, undo both the AI move and the human move (or 1 if at start)
      if (history.length >= 2) {
        const targetBoard = history[history.length - 2];
        setBoard(targetBoard);
        setHistory((prev) => prev.slice(0, prev.length - 2));
        setTurn(settings.humanPlayer);
      } else if (history.length === 1) {
        setBoard(history[0]);
        setHistory([]);
        setTurn(settings.humanPlayer);
      }
    } else {
      // In 2P mode, step back one move
      const previousBoard = history[history.length - 1];
      setBoard(previousBoard);
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setTurn((current) => (current === 'X' ? 'O' : 'X'));
    }
  }, [history, isAiThinking, status, settings.mode, settings.humanPlayer]);

  /**
   * Global Keyboard Shortcuts (Numpad 1-9, R restart, Esc menu, M mute, Space/Enter start/again)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mute toggle (M)
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleSound();
        return;
      }

      // Title Screen controls
      if (status === 'title') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      // Victory / Draw Modal controls
      if (status === 'won' || status === 'draw') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleResetRound();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleBackToMenu();
        }
        return;
      }

      // Playing Screen controls
      if (status === 'playing') {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleBackToMenu();
          return;
        }

        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          handleResetRound();
          return;
        }

        if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
          e.preventDefault();
          handleUndo();
          return;
        }

        // Direct keypad placement:
        // Regular top row digits '1' through '9' -> index 0 to 8
        const topRowKeys: Record<string, number> = {
          '1': 0, '2': 1, '3': 2,
          '4': 3, '5': 4, '6': 5,
          '7': 6, '8': 7, '9': 8,
        };

        // Standard Numpad layout mapping (e.g. Numpad7 is top-left, Numpad1 is bottom-left):
        const numpadKeys: Record<string, number> = {
          Numpad7: 0, Numpad8: 1, Numpad9: 2,
          Numpad4: 3, Numpad5: 4, Numpad6: 5,
          Numpad1: 6, Numpad2: 7, Numpad3: 8,
        };

        if (numpadKeys[e.code] !== undefined) {
          e.preventDefault();
          handleCellClick(numpadKeys[e.code]);
          return;
        }

        if (topRowKeys[e.key] !== undefined) {
          e.preventDefault();
          handleCellClick(topRowKeys[e.key]);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    status,
    handleToggleSound,
    handleStartGame,
    handleResetRound,
    handleBackToMenu,
    handleUndo,
    handleCellClick,
  ]);

  // Clean up any pending AI timers
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Confetti Particles on Win */}
      <ConfettiCanvas
        active={confettiActive}
        winnerColor={winInfo?.winner === 'X' ? 'cyan' : 'amber'}
      />

      {/* Screen 1: Title & Setup Screen */}
      {status === 'title' && (
        <TitleScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={handleStartGame}
        />
      )}

      {/* Screen 2: Active Gameplay Arena */}
      {status !== 'title' && (
        <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
          {/* Subtle Ambient Background */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Header & Scoreboard Cluster */}
          <header className="relative z-10 w-full pt-2">
            <GameScoreboard
              scores={scores}
              currentTurn={turn}
              gameMode={settings.mode}
              aiDifficulty={settings.difficulty}
              isAiThinking={isAiThinking}
              canUndo={history.length > 0}
              soundMuted={!settings.soundEnabled}
              onUndo={handleUndo}
              onResetRound={handleResetRound}
              onToggleSound={handleToggleSound}
              onOpenMenu={handleBackToMenu}
            />
          </header>

          {/* Central Interactive Grid */}
          <main className="relative z-10 w-full my-auto py-4 flex items-center justify-center">
            <GameBoard
              board={board}
              winInfo={winInfo}
              turn={turn}
              isAiThinking={isAiThinking}
              disabled={status !== 'playing'}
              showKeyHints={settings.showKeyHints}
              onCellClick={handleCellClick}
              onCellHover={() => sound.playHover()}
            />
          </main>

          {/* Flat Control Hints Bar */}
          <footer className="relative z-10 w-full text-center pb-2">
            <p className="font-mono text-[11px] text-slate-500 tracking-wider">
              1–9 Numpad / Digits · R Restart · Esc Menu · M Mute
            </p>
          </footer>

          {/* Screen 3: Victory / Game Over Modal */}
          {(status === 'won' || status === 'draw') && (
            <VictoryModal
              status={status}
              winInfo={winInfo}
              gameMode={settings.mode}
              humanPlayer={settings.humanPlayer}
              scores={scores}
              onPlayAgain={handleResetRound}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </div>
      )}
    </div>
  );
}
