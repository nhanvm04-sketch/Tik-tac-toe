import React from 'react';
import { Player, GameMode, AIDifficulty, ScoreBoard } from '../types';
import { Bot, User, Flame, RotateCcw, Volume2, VolumeX, Menu, Undo2 } from 'lucide-react';

interface GameScoreboardProps {
  scores: ScoreBoard;
  currentTurn: Player;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  isAiThinking: boolean;
  canUndo: boolean;
  soundMuted: boolean;
  onUndo: () => void;
  onResetRound: () => void;
  onToggleSound: () => void;
  onOpenMenu: () => void;
}

export const GameScoreboard: React.FC<GameScoreboardProps> = ({
  scores,
  currentTurn,
  gameMode,
  aiDifficulty,
  isAiThinking,
  canUndo,
  soundMuted,
  onUndo,
  onResetRound,
  onToggleSound,
  onOpenMenu,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto space-y-4">
      {/* Top Header Controls: Mode tag, streaks, sound, menu */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 font-mono flex items-center gap-1.5">
            {gameMode === 'ai' ? (
              <>
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span className="capitalize">{aiDifficulty} AI</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>2-Player Local</span>
              </>
            )}
          </span>

          {scores.streak > 1 && scores.streakHolder && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{scores.streak} Streak ({scores.streakHolder})</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            aria-label={soundMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/50"
            title="Toggle Sound (M)"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={onOpenMenu}
            aria-label="Open Game Menu"
            className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/50 flex items-center gap-1"
            title="Menu (Esc)"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Scoreboard Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Player X */}
        <div
          className={`relative p-3 rounded-2xl border transition-all duration-300 text-center flex flex-col justify-between
            ${
              currentTurn === 'X'
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }
          `}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-extrabold text-cyan-400 text-sm">X</span>
            <span className="text-[11px] font-semibold text-slate-400 truncate">
              {gameMode === 'ai' ? 'You' : 'Player 1'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white tabular-nums">
            {scores.xWins}
          </div>
          {currentTurn === 'X' && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              Turn
            </div>
          )}
          {currentTurn !== 'X' && <div className="mt-1 text-[10px] text-slate-500">Wins</div>}
        </div>

        {/* Draws */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Draws
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-300 tabular-nums">
            {scores.draws}
          </div>
          <div className="text-[10px] text-slate-500">
            {scores.totalGames > 0
              ? `${Math.round((scores.draws / scores.totalGames) * 100)}%`
              : '0%'}
          </div>
        </div>

        {/* Player O / AI */}
        <div
          className={`relative p-3 rounded-2xl border transition-all duration-300 text-center flex flex-col justify-between
            ${
              currentTurn === 'O'
                ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }
          `}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-extrabold text-amber-400 text-sm">O</span>
            <span className="text-[11px] font-semibold text-slate-400 truncate">
              {gameMode === 'ai' ? 'Bot' : 'Player 2'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white tabular-nums">
            {scores.oWins}
          </div>
          {currentTurn === 'O' && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              {isAiThinking ? 'Thinking...' : 'Turn'}
            </div>
          )}
          {currentTurn !== 'O' && <div className="mt-1 text-[10px] text-slate-500">Wins</div>}
        </div>
      </div>

      {/* Control Action Pills: Undo, Restart */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all
            ${
              canUndo && !isAiThinking
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white cursor-pointer active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }
          `}
          title="Undo last move"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        <button
          onClick={onResetRound}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all active:scale-95"
          title="Restart round (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Round (R)</span>
        </button>
      </div>
    </div>
  );
};
