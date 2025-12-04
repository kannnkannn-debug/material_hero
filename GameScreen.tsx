
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, X, CheckCircle, ArrowRight, Brain, Search, FlaskConical } from 'lucide-react';
import { MaterialItem, MaterialGroup } from '../types';
import { MATERIAL_DATA, MAX_LIVES } from '../constants';
import { getExplanation } from '../services/geminiService';
import { playSound } from '../services/audioService';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [currentItem, setCurrentItem] = useState<MaterialItem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [itemsPool, setItemsPool] = useState<MaterialItem[]>([...MATERIAL_DATA]);
  
  // Gameplay State
  const [step, setStep] = useState<1 | 2>(1); // 1 = Identify Material, 2 = Identify Group
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  
  // Feedback Modal State
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);

  // --- Logic Helpers ---

  // Generate 3 random material options (1 correct, 2 distractors)
  const generateMaterialOptions = useCallback((correctMaterial: string) => {
    // Get unique materials from data
    const allMaterials = Array.from(new Set(MATERIAL_DATA.map(i => i.material)));
    // Filter out the correct one
    const distractors = allMaterials.filter(m => m !== correctMaterial);
    // Shuffle distractors
    const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
    // Take 2
    const selectedDistractors = shuffledDistractors.slice(0, 2);
    // Combine and shuffle again
    const options = [correctMaterial, ...selectedDistractors].sort(() => 0.5 - Math.random());
    setMaterialOptions(options);
  }, []);

  const pickRandomItem = useCallback(() => {
    if (itemsPool.length === 0) {
      onGameOver(score);
      return;
    }
    const randomIndex = Math.floor(Math.random() * itemsPool.length);
    const item = itemsPool[randomIndex];
    setCurrentItem(item);
    setStep(1); // Reset to step 1
    generateMaterialOptions(item.material);
  }, [itemsPool, onGameOver, score, generateMaterialOptions]);

  useEffect(() => {
    pickRandomItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerExplanation = async (item: MaterialItem) => {
    setIsExplaining(true);
    setExplanation('...ศาสตราจารย์กำลังวิเคราะห์ข้อมูล...');
    const text = await getExplanation(item);
    setExplanation(text);
    setIsExplaining(false);
  };

  // --- Handlers ---

  const handleStep1Guess = (selectedMaterial: string) => {
    if (!currentItem) return;
    playSound('click');

    if (selectedMaterial === currentItem.material) {
      // Correct Material -> Move to Step 2
      playSound('correct');
      setStep(2);
    } else {
      // Wrong Material -> Immediate Fail
      handleFailure();
    }
  };

  const handleStep2Guess = (selectedGroup: MaterialGroup) => {
    if (!currentItem) return;
    playSound('click');

    if (selectedGroup === currentItem.group) {
      // Correct Group -> Win Item
      handleSuccess();
    } else {
      // Wrong Group -> Fail
      handleFailure();
    }
  };

  const handleSuccess = () => {
    playSound('correct');
    setLastResult('correct');
    setScore(prev => prev + 10); // +10 for completing both steps
    setShowFeedback(true);
    setExplanation(''); 
    // Remove item from pool
    setItemsPool(prev => prev.filter(i => i.id !== currentItem?.id));
  };

  const handleFailure = () => {
    playSound('wrong');
    setLastResult('wrong');
    setLives(prev => prev - 1);
    setShowFeedback(true);
    if (currentItem) triggerExplanation(currentItem);
  };

  const handleNext = () => {
    playSound('click');
    setShowFeedback(false);
    
    if (lives <= 0 && lastResult === 'wrong') {
       onGameOver(score);
    } else {
       pickRandomItem();
    }
  };

  useEffect(() => {
    if (lives === 0 && !showFeedback) {
      onGameOver(score);
    }
  }, [lives, showFeedback, onGameOver, score]);


  if (!currentItem) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">กำลังเตรียมห้องทดลอง...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 overflow-hidden relative font-sans">
      
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm flex justify-between items-center z-10 sticky top-0 border-b border-indigo-100">
        <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-200 shadow-sm">
          <Star className="text-yellow-500 fill-yellow-500 w-5 h-5 animate-pulse" />
          <span className="font-extrabold text-xl text-yellow-700">{score}</span>
        </div>
        
        <div className="flex space-x-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart 
              key={i} 
              className={`w-7 h-7 drop-shadow-sm transition-all duration-500 ${i < lives ? 'text-red-500 fill-red-500 scale-100' : 'text-gray-200 scale-90'}`} 
            />
          ))}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center p-4 max-w-xl mx-auto w-full z-0">
        
        {/* Progress Stepper */}
        <div className="flex items-center space-x-2 mb-6 mt-2">
            <div className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-200'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`} />
            <span className="text-xs font-bold text-indigo-400 ml-2">ขั้นที่ {step}/2</span>
        </div>

        {/* Professor Hint */}
        <div className="flex items-end w-full mb-4 animate-in slide-in-from-left duration-500">
            <div className="w-14 h-14 bg-indigo-100 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-2xl z-10 relative -mr-3">
                👨‍🔬
            </div>
            <div className="bg-white/90 backdrop-blur py-3 px-6 rounded-2xl rounded-bl-none shadow-sm text-gray-600 text-sm font-medium border border-indigo-50 flex-1">
                {step === 1 ? `วัตถุชิ้นนี้... ทำมาจากวัสดุอะไรนะ?` : `เก่งมาก! แล้ว "${currentItem.material}" อยู่กลุ่มไหน?`}
            </div>
        </div>

        {/* Object Card */}
        <div className="w-full bg-white rounded-[2rem] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] p-8 text-center relative mb-8 border border-white/50 transition-all duration-300">
          <div className="absolute top-4 right-6 text-gray-300 font-bold text-xs tracking-widest uppercase">Level 1</div>
          
          <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
             {step === 1 ? '📦' : '✨'}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-2">
            {currentItem.name}
          </h2>
          
          {step === 2 && (
             <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold animate-in zoom-in">
                ทำจาก: {currentItem.material}
             </div>
          )}
        </div>

        {/* Action Area */}
        <div className="w-full animate-in slide-in-from-bottom duration-500 fade-in">
          {step === 1 ? (
             /* STEP 1: MATERIAL SELECTION */
             <div className="grid grid-cols-1 gap-3">
                <p className="text-center text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">เลือกวัสดุให้ถูกต้อง</p>
                {materialOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStep1Guess(opt)}
                    className="bg-white hover:bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 text-indigo-900 font-bold py-4 px-6 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <Search className="text-indigo-200 group-hover:text-indigo-400 transition-colors" size={20} />
                  </button>
                ))}
             </div>
          ) : (
             /* STEP 2: GROUP SELECTION */
             <div className="grid grid-cols-3 gap-3">
                 <div className="col-span-3 text-center text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">จัดกลุ่มวัสดุ</div>
                {[
                    { group: MaterialGroup.POLYMER, label: "พอลิเมอร์", color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" },
                    { group: MaterialGroup.CERAMIC, label: "เซรามิก", color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200" },
                    { group: MaterialGroup.METAL, label: "โลหะ", color: "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300" }
                ].map((btn) => (
                    <button
                        key={btn.group}
                        onClick={() => handleStep2Guess(btn.group)}
                        className={`
                            ${btn.color} border-b-4 py-4 px-2 rounded-2xl shadow-md font-bold text-lg flex flex-col items-center justify-center h-28 active:border-b-0 active:translate-y-1 transition-all
                        `}
                    >
                        <FlaskConical size={28} className="mb-2 opacity-50" />
                        {btn.label}
                    </button>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`
                w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden
                animate-in slide-in-from-bottom-10 duration-300
                flex flex-col relative
            `}>
                {/* Header */}
                <div className={`p-8 text-center ${lastResult === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {lastResult === 'correct' ? (
                        <div className="flex flex-col items-center">
                            <div className="bg-green-500 text-white p-3 rounded-full mb-3 shadow-lg shadow-green-200 animate-bounce">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-green-800">สุดยอด!</h2>
                            <p className="text-green-600 font-medium mt-1">แยกประเภทได้ถูกต้องครับ</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-red-500 text-white p-3 rounded-full mb-3 shadow-lg shadow-red-200 animate-shake">
                                <X size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-red-800">ผิดพลาดนิดหน่อย!</h2>
                            <div className="mt-2 bg-white/50 px-4 py-2 rounded-lg">
                                <p className="text-red-600 text-sm">เฉลย: <strong>{currentItem.name}</strong></p>
                                <p className="text-slate-800 font-bold">ทำจาก {currentItem.material} ({currentItem.group})</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 bg-white space-y-4">
                    {/* Explanation Box */}
                    {(lastResult === 'wrong' || explanation) && (
                        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 relative mt-2">
                            <div className="absolute -top-3 -left-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Brain size={10} />
                                AI EXPLANATION
                            </div>
                            
                            {isExplaining ? (
                                <div className="flex items-center justify-center space-x-2 py-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {explanation || "ลองอ่านคำอธิบายจากศาสตราจารย์ดูนะ..."}
                                </p>
                            )}
                        </div>
                    )}

                    <button 
                        onClick={handleNext}
                        className={`
                            w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3
                            ${lastResult === 'correct' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200' 
                                : 'bg-slate-800 text-white shadow-slate-300'}
                        `}
                    >
                        <span>ข้อต่อไป</span>
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default GameScreen;
