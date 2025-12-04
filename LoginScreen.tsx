
import React, { useState } from 'react';
import { Sparkles, Dice5, ArrowRight } from 'lucide-react';
import { generateRandomName } from '../services/nameService';
import { playSound } from '../services/audioService';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleRandomName = () => {
    playSound('click');
    setName(generateRandomName());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      playSound('correct');
      onLogin(name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden font-sans">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full mx-4 border border-white/50 relative z-10 animate-bounce-short">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4 shadow-inner">
            <Sparkles className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">ยินดีต้อนรับ!</h1>
          <p className="text-slate-500">กรอกชื่อของคุณเพื่อเริ่มผจญภัย</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">ชื่อนักวิทยาศาสตร์</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อเล่น..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 text-lg font-bold text-indigo-900 transition-colors"
                maxLength={15}
                required
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 p-4 rounded-2xl transition-colors"
                title="สุ่มชื่อ"
              >
                <Dice5 size={28} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transform transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>ไปลุยกันเลย</span>
            <ArrowRight strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
