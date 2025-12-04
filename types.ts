
export enum MaterialGroup {
  POLYMER = 'Polymer',
  CERAMIC = 'Ceramic',
  METAL = 'Metal'
}

export interface MaterialItem {
  id: number;
  name: string;
  material: string;
  group: MaterialGroup;
}

export interface GameState {
  currentScreen: 'login' | 'start' | 'playing' | 'gameover';
  playerName: string;
  score: number;
  highScore: number;
  lives: number;
  itemsAnswered: number;
}
