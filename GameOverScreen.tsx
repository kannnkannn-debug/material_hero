
import React, { useEffect } from 'react';
import { RefreshCw, Trophy, Frown } from 'lucide-react';
import { playSound } from '../services/audioService';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isHighScore = score >= highScore && score > 0;

  useEffect(() => {
    playSound(isHighScore ? 'correct' : 'gameover');
  }, [isHighScore]);

  const handleRestart = () => {
    playSound('click');
    onRestart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 relative overflow-hidden font-sans">
      
      <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center max-w-lg w-full border border-white relative z-10 animate-in zoom-in duration-300">
        
        <div className="mb-8 flex justify-center -mt-24">
          {isHighScore ? (
             <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 rounded-full shadow-lg border-[6px] border-white animate-bounce-short">
               <Trophy size={80} className="text-yellow-600 drop-shadow-sm" />
             </div>
          ) : (
            <div className="bg-slate-100 p-8 rounded-full shadow-lg border-[6px] border-white">
               <div className="relative">
                  <Trophy size={80} className="text-gray-300" />
                  <Frown size={32} className="absolute bottom-0 right-0 text-gray-400 bg-white rounded-full p-1 shadow-sm" />
               </div>
            </div>
          )}
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-2">
            {isHighScore ? 'New High Score!' : 'Game Over'}
        </h2>
        <p className="text-slate-500 mb-10 font-medium">
            {isHighScore ? 'สุดยอด! คุณคือมาสเตอร์ตัวจริง' : 'พยายามได้ดีมาก ลองใหม่อีกครั้งนะ'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center">
            <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">SCORE</p>
            <p className="text-4xl font-black text-indigo-600">{score}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex flex-col items-center">
            <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-2">BEST</p>
            <p className="text-4xl font-black text-yellow-600">{isHighScore ? score : highScore}</p>
          </div>
        </div>

        <button 
          onClick={handleRestart}
          className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-black text-white font-bold py-5 px-8 rounded-2xl shadow-xl transform transition active:scale-95 group"
        >
          <RefreshCw size={24} className={`group-hover:rotate-180 transition-transform duration-500`} />
          <span className="text-xl">เล่นอีกครั้ง</span>
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
