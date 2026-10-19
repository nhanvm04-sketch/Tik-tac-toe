import React from 'react';
import { BoardState, Player, WinInfo } from '../types';

interface GameBoardProps {
  board: BoardState;
  winInfo: WinInfo | null;
  turn: Player;
  isAiThinking: boolean;
  disabled: boolean;
  showKeyHints: boolean;
  onCellClick: (index: number) => void;
  onCellHover?: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winInfo,
  turn,
  isAiThinking,
  disabled,
  showKeyHints,
  onCellClick,
  onCellHover,
}) => {
  // Mapping for numpad hints:
  // Layout on screen:
  // [0, 1, 2] -> 1, 2, 3 or standard 7, 8, 9 numpad. We provide clear 1-9 numbering.
  const keyLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const isWinningCell = (index: number) => {
    return winInfo ? winInfo.combination.includes(index) : false;
  };

  /**
   * Helper to compute winning strike-through line coordinates in percentage
   */
  const getLineCoordinates = () => {
    if (!winInfo) return null;
    const { orientation } = winInfo;

    // Board cell center positions in %: 16.66%, 50%, 83.33%
    switch (orientation) {
      case 'row-0':
        return { x1: '8%', y1: '16.66%', x2: '92%', y2: '16.66%' };
      case 'row-1':
        return { x1: '8%', y1: '50%', x2: '92%', y2: '50%' };
      case 'row-2':
        return { x1: '8%', y1: '83.33%', x2: '92%', y2: '83.33%' };
      case 'col-0':
        return { x1: '16.66%', y1: '8%', x2: '16.66%', y2: '92%' };
      case 'col-1':
        return { x1: '50%', y1: '8%', x2: '50%', y2: '92%' };
      case 'col-2':
        return { x1: '83.33%', y1: '8%', x2: '83.33%', y2: '92%' };
      case 'diag-main': // 0 -> 8
        return { x1: '10%', y1: '10%', x2: '90%', y2: '90%' };
      case 'diag-anti': // 2 -> 6
        return { x1: '90%', y1: '10%', x2: '10%', y2: '90%' };
      default:
        return null;
    }
  };

  const lineCoords = getLineCoordinates();

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] aspect-square select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-amber-500/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Grid Frame */}
      <div className="relative h-full w-full p-3 sm:p-4 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-2.5 sm:gap-3">
          {board.map((cell, index) => {
            const isWinner = isWinningCell(index);
            const isAvailable = cell === null && !disabled && !isAiThinking;

            return (
              <button
                key={index}
                onClick={() => isAvailable && onCellClick(index)}
                onMouseEnter={() => isAvailable && onCellHover?.(index)}
                disabled={!isAvailable}
                aria-label={`Cell ${index + 1}, ${cell ? cell : 'empty'}`}
                className={`group relative flex items-center justify-center rounded-2xl transition-all duration-200 outline-none
                  ${
                    isWinner
                      ? cell === 'X'
                        ? 'bg-cyan-950/70 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-[1.02]'
                        : 'bg-amber-950/70 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-[1.02]'
                      : cell !== null
                      ? 'bg-slate-800/80 border border-slate-700/60 shadow-inner'
                      : isAvailable
                      ? 'bg-slate-800/40 hover:bg-slate-800/90 border border-slate-700/50 hover:border-slate-500 hover:shadow-lg active:scale-95 cursor-pointer'
                      : 'bg-slate-800/30 border border-slate-800/60 cursor-default'
                  }
                `}
              >
                {/* Cell Number Key Hint */}
                {showKeyHints && (
                  <span className="absolute top-1.5 left-2 font-mono text-[10px] text-slate-500/70 font-semibold pointer-events-none transition-opacity group-hover:text-slate-300">
                    {keyLabels[index]}
                  </span>
                )}

                {/* Placed Mark: X */}
                {cell === 'X' && (
                  <div className="animate-in zoom-in-50 duration-200 flex items-center justify-center w-full h-full p-4 sm:p-5">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    >
                      <path d="M16 16 L48 48" className="text-cyan-400" />
                      <path d="M48 16 L16 48" className="text-cyan-400" />
                    </svg>
                  </div>
                )}

                {/* Placed Mark: O */}
                {cell === 'O' && (
                  <div className="animate-in zoom-in-50 duration-200 flex items-center justify-center w-full h-full p-4 sm:p-5">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    >
                      <circle cx="32" cy="32" r="20" className="text-amber-400" />
                    </svg>
                  </div>
                )}

                {/* Ghost Hover Preview for Empty Cell */}
                {cell === null && isAvailable && (
                  <div className="opacity-0 group-hover:opacity-30 transition-opacity duration-150 flex items-center justify-center w-full h-full p-5 pointer-events-none">
                    {turn === 'X' ? (
                      <svg
                        viewBox="0 0 64 64"
                        className="w-full h-full text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                      >
                        <path d="M18 18 L46 46" />
                        <path d="M46 18 L18 46" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 64 64"
                        className="w-full h-full text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                      >
                        <circle cx="32" cy="32" r="18" />
                      </svg>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Strike-Through Win Line SVG Overlay */}
        {winInfo && lineCoords && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none p-3 sm:p-4 z-20 overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="winLineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={winInfo.winner === 'X' ? '#22d3ee' : '#fbbf24'}
                />
                <stop
                  offset="50%"
                  stopColor="#ffffff"
                />
                <stop
                  offset="100%"
                  stopColor={winInfo.winner === 'X' ? '#06b6d4' : '#f59e0b'}
                />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing outer beam */}
            <line
              x1={lineCoords.x1}
              y1={lineCoords.y1}
              x2={lineCoords.x2}
              y2={lineCoords.y2}
              stroke={winInfo.winner === 'X' ? 'rgba(6,182,212,0.8)' : 'rgba(245,158,11,0.8)'}
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#laserGlow)"
              className="animate-pulse"
            />
            {/* Core sharp laser beam */}
            <line
              x1={lineCoords.x1}
              y1={lineCoords.y1}
              x2={lineCoords.x2}
              y2={lineCoords.y2}
              stroke="url(#winLineGlow)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
