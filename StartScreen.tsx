
import React from 'react';
import { Beaker, Layers, GraduationCap, Play, LogOut, Trophy } from 'lucide-react';
import { playSound } from '../services/audioService';

interface StartScreenProps {
  playerName: string;
  onStart: () => void;
  onLogout: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ playerName, onStart, onLogout, highScore }) => {
  const handleStart = () => {
    playSound('click');
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F9FF] overflow-hidden relative font-sans">
      {/* Background Decor - Fixed overlapping issues */}
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none select-none">
         <Layers size={250} />
      </div>
      <div className="absolute -bottom-10 -left-10 opacity-5 pointer-events-none select-none">
         <Beaker size={200} />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md px-6 py-8">
        
        {/* User Badge - Improved z-index and spacing */}
        <div className="self-end mb-6 flex items-center gap-2 relative z-20">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-indigo-50 flex items-center gap-2">
                <span className="text-sm font-bold text-indigo-900 truncate max-w-[150px]">👋 สวัสดี, {playerName}</span>
            </div>
            <button 
                onClick={onLogout} 
                className="bg-white/90 p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all border border-indigo-50 shadow-sm"
                title="ออกจากระบบ"
            >
                <LogOut size={18} />
            </button>
        </div>

        {/* Professor Avatar */}
        <div className="mb-8 relative group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-40 h-40 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] border-4 border-white z-10 relative rotate-3">
             <GraduationCap size={80} className="text-indigo-600 drop-shadow-sm" />
          </div>
          <div className="absolute -bottom-4 w-full text-center z-20">
            <span className="bg-indigo-600 text-white text-sm py-1.5 px-5 rounded-full font-bold tracking-wider shadow-md ring-2 ring-white">
                ศาสตราจารย์ไซน์
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm mb-2 tracking-tight">
            Material Master
          </h1>
          <div className="inline-block bg-orange-400 text-white text-lg font-bold px-4 py-1 rounded-lg transform -rotate-2 shadow-md">
            ภารกิจแยกวัสดุ 2 ขั้นตอน
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] w-full border border-white relative z-10">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-100 shadow-inner">
              <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">คะแนนสูงสุด</span>
                  <span className="text-2xl font-black text-yellow-700 leading-none mt-1">{highScore}</span>
              </div>
              <div className="bg-white p-2 rounded-full text-yellow-500 shadow-sm">
                  <Trophy size={24} />
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xl font-bold py-5 px-8 rounded-2xl shadow-xl shadow-slate-200 transform transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play fill="white" size={18} />
              </div>
              เริ่มเกมเลย!
            </button>
            
            <div className="text-center">
                <p className="text-indigo-400 text-xs font-semibold tracking-wide">
                    วิทยาศาสตร์ครูกานต์ โรงเรียนชุมชนมาบอำมฤต
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
