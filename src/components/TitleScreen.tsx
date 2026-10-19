import React from 'react';
import { GameMode, AIDifficulty, Player, GameSettings } from '../types';
import { Bot, Users, Volume2, VolumeX, Sparkles, Trophy, Play, Keyboard } from 'lucide-react';

interface TitleScreenProps {
  settings: GameSettings;
  onUpdateSettings: (updater: (prev: GameSettings) => GameSettings) => void;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Atmospheric Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Top Bar: Sound & Clean branding indicator */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Tactical 3x3 Arena
          </span>
        </div>

        <button
          onClick={() =>
            onUpdateSettings((prev) => ({
              ...prev,
              soundEnabled: !prev.soundEnabled,
            }))
          }
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toggle Audio (M)"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </header>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup & Interactive Visual */}
      <main className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto py-6">
        {/* Bespoke SVG Title Lockup */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* Animated Mini Grid Icon */}
            <svg
              viewBox="0 0 48 48"
              className="w-12 h-12 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <line x1="16" y1="6" x2="16" y2="42" className="text-slate-700" />
              <line x1="32" y1="6" x2="32" y2="42" className="text-slate-700" />
              <line x1="6" y1="16" x2="42" y2="16" className="text-slate-700" />
              <line x1="6" y1="32" x2="42" y2="32" className="text-slate-700" />
              {/* Highlight marks */}
              <line x1="9" y1="9" x2="13" y2="13" className="text-cyan-400" />
              <line x1="13" y1="9" x2="9" y2="13" className="text-cyan-400" />
              <circle cx="37" cy="24" r="2.5" className="text-amber-400" />
            </svg>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-100 to-amber-300 bg-clip-text text-transparent">
              NEXUS TTT
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-medium">
            Classic 3×3 reimagined with unbeatable Minimax AI, tactile audio synthesis, and pass-and-play.
          </p>
        </div>

        {/* Game Setup Box */}
        <div className="w-full bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5">
          {/* 1. Mode Select: Solo vs Bot / 2 Player */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, mode: 'ai' }))
                }
                className={`py-2.5 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${
                    settings.mode === 'ai'
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }
                `}
              >
                <Bot className="w-4 h-4" />
                <span>Single Player</span>
              </button>

              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, mode: 'pvp' }))
                }
                className={`py-2.5 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${
                    settings.mode === 'pvp'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }
                `}
              >
                <Users className="w-4 h-4" />
                <span>2-Player Local</span>
              </button>
            </div>
          </div>

          {/* 2. AI Difficulty (Only shown when mode is 'ai') */}
          {settings.mode === 'ai' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
                AI Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => {
                  const isSelected = settings.difficulty === diff;
                  const label =
                    diff === 'easy'
                      ? 'Novice'
                      : diff === 'medium'
                      ? 'Challenger'
                      : 'Unbeatable';

                  return (
                    <button
                      key={diff}
                      onClick={() =>
                        onUpdateSettings((prev) => ({ ...prev, difficulty: diff }))
                      }
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer
                        ${
                          isSelected
                            ? diff === 'hard'
                              ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                              : diff === 'medium'
                              ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                              : 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Choose Symbol */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
              {settings.mode === 'ai' ? 'Your Symbol' : 'First Move'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, humanPlayer: 'X' }))
                }
                className={`py-2 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${
                    settings.humanPlayer === 'X'
                      ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <span className="font-extrabold text-cyan-400 text-base">X</span>
                <span>First Turn</span>
              </button>

              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, humanPlayer: 'O' }))
                }
                className={`py-2 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${
                    settings.humanPlayer === 'O'
                      ? 'bg-amber-950/50 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <span className="font-extrabold text-amber-400 text-base">O</span>
                <span>Second Turn</span>
              </button>
            </div>
          </div>

          {/* Toggle for Number hints */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              Show 1-9 Numpad key guides
            </span>
            <input
              type="checkbox"
              id="key-hints"
              checked={settings.showKeyHints}
              onChange={(e) =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  showKeyHints: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Primary Start Game CTA */}
          <button
            onClick={onStartGame}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer active:scale-98"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>START GAME</span>
          </button>
        </div>
      </main>

      {/* Flat Control Hints Line (Game Craft spec) */}
      <footer className="relative z-10 w-full max-w-xl text-center py-2">
        <p className="font-mono text-xs text-slate-500 tracking-wider">
          Space / Enter to Start · 1–9 Numpad to Place · R Restart · Esc Menu · M Mute
        </p>
      </footer>
    </div>
  );
};
