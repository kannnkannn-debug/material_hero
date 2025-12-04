
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'login',
    playerName: '',
    score: 0,
    highScore: 0,
    lives: 3,
    itemsAnswered: 0
  });

  // Load high score from local storage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('materialMasterHighScore');
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore, 10) }));
    }
  }, []);

  const handleLogin = (name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name,
      currentScreen: 'start'
    }));
  };

  const handleLogout = () => {
    setGameState(prev => ({
      ...prev,
      playerName: '',
      currentScreen: 'login'
    }));
  }

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'playing',
      score: 0,
      lives: 3,
      itemsAnswered: 0
    }));
  };

  const endGame = (finalScore: number) => {
    const newHighScore = Math.max(finalScore, gameState.highScore);
    localStorage.setItem('materialMasterHighScore', newHighScore.toString());
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'gameover',
      score: finalScore,
      highScore: newHighScore
    }));
  };

  return (
    <div className="antialiased text-slate-800">
      {gameState.currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      {gameState.currentScreen === 'start' && (
        <StartScreen 
          playerName={gameState.playerName}
          onStart={startGame} 
          onLogout={handleLogout}
          highScore={gameState.highScore} 
        />
      )}
      {gameState.currentScreen === 'playing' && (
        <GameScreen onGameOver={endGame} />
      )}
      {gameState.currentScreen === 'gameover' && (
        <GameOverScreen 
          score={gameState.score} 
          highScore={gameState.highScore} 
          onRestart={startGame} 
        />
      )}
    </div>
  );
};

export default App;
