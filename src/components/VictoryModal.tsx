import React from 'react';
import { Player, GameMode, WinInfo, ScoreBoard } from '../types';
import { Trophy, RotateCcw, Home, Sparkles, Meh, ShieldAlert } from 'lucide-react';

interface VictoryModalProps {
  status: 'won' | 'draw';
  winInfo: WinInfo | null;
  gameMode: GameMode;
  humanPlayer: Player;
  scores: ScoreBoard;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  status,
  winInfo,
  gameMode,
  humanPlayer,
  scores,
  onPlayAgain,
  onBackToMenu,
}) => {
  const isDraw = status === 'draw';
  const winner = winInfo?.winner;
  const isHumanWinner = gameMode === 'ai' ? winner === humanPlayer : true;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Outcome Icon & Title */}
        <div className="flex flex-col items-center">
          {isDraw ? (
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 text-slate-300">
              <Meh className="w-8 h-8 text-slate-400" />
            </div>
          ) : isHumanWinner ? (
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
                winner === 'X'
                  ? 'bg-cyan-950/80 border border-cyan-500/80 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-amber-950/80 border border-amber-500/80 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isDraw
              ? "IT'S A DRAW!"
              : gameMode === 'ai'
              ? isHumanWinner
                ? 'VICTORY!'
                : 'BOT WON THIS ROUND'
              : `PLAYER ${winner} WINS!`}
          </h2>

          <p className="text-xs text-slate-400 mt-1 font-medium">
            {isDraw
              ? 'Evenly matched. Neither grid gave in.'
              : gameMode === 'ai'
              ? isHumanWinner
                ? 'Outstanding move! You outmaneuvered the system.'
                : 'The AI found the winning alignment. Rematch?'
              : `Congratulations Player ${winner}! Well played.`}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="py-2.5 px-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-around text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">X Wins</div>
            <div className="text-white font-bold text-sm">{scores.xWins}</div>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Draws</div>
            <div className="text-white font-bold text-sm">{scores.draws}</div>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase">O Wins</div>
            <div className="text-white font-bold text-sm">{scores.oWins}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN (Space)</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MENU & SETTINGS (Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
