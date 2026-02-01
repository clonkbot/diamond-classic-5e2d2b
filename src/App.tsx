import { useState, useCallback, useEffect } from 'react';
import './App.css';
import Scoreboard from './components/Scoreboard';
import Field from './components/Field';
import PitchZone from './components/PitchZone';
import GameControls from './components/GameControls';

export type GameState = 'waiting' | 'pitching' | 'batting' | 'result';
export type PitchResult = 'strike' | 'ball' | 'hit' | 'foul' | 'homerun' | 'out' | null;

interface GameData {
  inning: number;
  isTop: boolean;
  strikes: number;
  balls: number;
  outs: number;
  homeScore: number;
  awayScore: number;
  bases: [boolean, boolean, boolean];
}

const initialGameData: GameData = {
  inning: 1,
  isTop: true,
  strikes: 0,
  balls: 0,
  outs: 0,
  homeScore: 0,
  awayScore: 0,
  bases: [false, false, false],
};

function App() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [gameData, setGameData] = useState<GameData>(initialGameData);
  const [pitchLocation, setPitchLocation] = useState<{ x: number; y: number } | null>(null);
  const [swingTiming, setSwingTiming] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<PitchResult>(null);
  const [gameOver, setGameOver] = useState(false);

  const resetCount = useCallback(() => {
    setGameData(prev => ({ ...prev, strikes: 0, balls: 0 }));
  }, []);

  const advanceRunners = useCallback((bases: [boolean, boolean, boolean], numBases: number): { newBases: [boolean, boolean, boolean]; runs: number } => {
    let runs = 0;
    let newBases: [boolean, boolean, boolean] = [...bases];

    for (let i = 0; i < numBases; i++) {
      if (newBases[2]) runs++;
      newBases = [false, newBases[0], newBases[1]];
    }
    newBases[0] = true;

    return { newBases, runs };
  }, []);

  const nextBatter = useCallback(() => {
    setGameData(prev => {
      const newOuts = prev.outs + 1;
      if (newOuts >= 3) {
        const nextIsTop = !prev.isTop;
        const nextInning = nextIsTop ? prev.inning + 1 : prev.inning;

        if (nextInning > 9) {
          setGameOver(true);
          return prev;
        }

        return {
          ...prev,
          outs: 0,
          strikes: 0,
          balls: 0,
          isTop: nextIsTop,
          inning: nextInning,
          bases: [false, false, false],
        };
      }
      return { ...prev, outs: newOuts, strikes: 0, balls: 0 };
    });
  }, []);

  const handlePitch = useCallback(() => {
    setGameState('pitching');
    setLastResult(null);

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    setPitchLocation({ x, y });

    setTimeout(() => {
      setGameState('batting');
    }, 800);
  }, []);

  const handleSwing = useCallback(() => {
    if (gameState !== 'batting' || !pitchLocation) return;

    const timing = Math.random();
    setSwingTiming(timing);
    setGameState('result');

    const isInZone = pitchLocation.x > 20 && pitchLocation.x < 80 &&
                     pitchLocation.y > 20 && pitchLocation.y < 80;

    const contactChance = isInZone ? 0.7 : 0.3;
    const madeContact = Math.random() < contactChance;

    if (!madeContact) {
      setLastResult('strike');
      setGameData(prev => {
        const newStrikes = prev.strikes + 1;
        if (newStrikes >= 3) {
          setTimeout(() => nextBatter(), 1000);
          return { ...prev, strikes: 0 };
        }
        return { ...prev, strikes: newStrikes };
      });
    } else {
      const hitRoll = Math.random();
      if (hitRoll < 0.15) {
        setLastResult('homerun');
        setGameData(prev => {
          const runsScored = 1 + prev.bases.filter(b => b).length;
          return {
            ...prev,
            [prev.isTop ? 'awayScore' : 'homeScore']: prev[prev.isTop ? 'awayScore' : 'homeScore'] + runsScored,
            bases: [false, false, false],
            strikes: 0,
            balls: 0,
          };
        });
      } else if (hitRoll < 0.35) {
        setLastResult('foul');
        setGameData(prev => ({
          ...prev,
          strikes: Math.min(prev.strikes + 1, 2),
        }));
      } else if (hitRoll < 0.55) {
        setLastResult('out');
        setTimeout(() => nextBatter(), 1000);
      } else {
        setLastResult('hit');
        const basesHit = Math.random() < 0.6 ? 1 : Math.random() < 0.7 ? 2 : 3;
        setGameData(prev => {
          const { newBases, runs } = advanceRunners(prev.bases, basesHit);
          return {
            ...prev,
            bases: newBases,
            [prev.isTop ? 'awayScore' : 'homeScore']: prev[prev.isTop ? 'awayScore' : 'homeScore'] + runs,
            strikes: 0,
            balls: 0,
          };
        });
      }
    }

    setTimeout(() => {
      setGameState('waiting');
      setPitchLocation(null);
      setSwingTiming(null);
    }, 1500);
  }, [gameState, pitchLocation, nextBatter, advanceRunners]);

  const handleTake = useCallback(() => {
    if (gameState !== 'batting' || !pitchLocation) return;

    setGameState('result');

    const isInZone = pitchLocation.x > 20 && pitchLocation.x < 80 &&
                     pitchLocation.y > 20 && pitchLocation.y < 80;

    if (isInZone) {
      setLastResult('strike');
      setGameData(prev => {
        const newStrikes = prev.strikes + 1;
        if (newStrikes >= 3) {
          setTimeout(() => nextBatter(), 1000);
          return { ...prev, strikes: 0 };
        }
        return { ...prev, strikes: newStrikes };
      });
    } else {
      setLastResult('ball');
      setGameData(prev => {
        const newBalls = prev.balls + 1;
        if (newBalls >= 4) {
          const { newBases, runs } = advanceRunners(prev.bases, 1);
          return {
            ...prev,
            balls: 0,
            strikes: 0,
            bases: newBases,
            [prev.isTop ? 'awayScore' : 'homeScore']: prev[prev.isTop ? 'awayScore' : 'homeScore'] + runs,
          };
        }
        return { ...prev, balls: newBalls };
      });
    }

    setTimeout(() => {
      setGameState('waiting');
      setPitchLocation(null);
    }, 1200);
  }, [gameState, pitchLocation, nextBatter, advanceRunners]);

  const resetGame = useCallback(() => {
    setGameData(initialGameData);
    setGameState('waiting');
    setGameOver(false);
    setLastResult(null);
    setPitchLocation(null);
    setSwingTiming(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'waiting' && !gameOver) {
          handlePitch();
        } else if (gameState === 'batting') {
          handleSwing();
        }
      } else if (e.code === 'KeyT' && gameState === 'batting') {
        handleTake();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, gameOver, handlePitch, handleSwing, handleTake]);

  return (
    <div className="app">
      <div className="stadium-lights">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="light-tower" style={{ left: `${8 + i * 8}%` }}>
            <div className="light-glow"></div>
          </div>
        ))}
      </div>

      <header className="header">
        <div className="header-decoration left"></div>
        <h1 className="title">
          <span className="title-main">DIAMOND</span>
          <span className="title-sub">CLASSIC</span>
        </h1>
        <div className="header-decoration right"></div>
      </header>

      <main className="main-content">
        <Scoreboard gameData={gameData} />

        <div className="game-area">
          <Field bases={gameData.bases} lastResult={lastResult} />
          <PitchZone
            pitchLocation={pitchLocation}
            gameState={gameState}
            swingTiming={swingTiming}
          />
        </div>

        <GameControls
          gameState={gameState}
          gameOver={gameOver}
          lastResult={lastResult}
          onPitch={handlePitch}
          onSwing={handleSwing}
          onTake={handleTake}
          onReset={resetGame}
          gameData={gameData}
        />
      </main>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <div className="game-over-lights">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bulb-light" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <h2>FINAL SCORE</h2>
            <div className="final-score">
              <div className="team-final">
                <span className="team-label">VISITORS</span>
                <span className="team-score">{gameData.awayScore}</span>
              </div>
              <div className="vs">—</div>
              <div className="team-final">
                <span className="team-label">HOME</span>
                <span className="team-score">{gameData.homeScore}</span>
              </div>
            </div>
            <p className="winner">
              {gameData.homeScore > gameData.awayScore ? 'HOME TEAM WINS!' :
               gameData.awayScore > gameData.homeScore ? 'VISITORS WIN!' : 'TIE GAME!'}
            </p>
            <button className="reset-btn" onClick={resetGame}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        Requested by @stringer_kade · Built by @clonkbot
      </footer>
    </div>
  );
}

export default App;
