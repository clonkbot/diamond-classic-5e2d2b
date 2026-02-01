import './GameControls.css';
import type { GameState, PitchResult } from '../App';

interface GameControlsProps {
  gameState: GameState;
  gameOver: boolean;
  lastResult: PitchResult;
  onPitch: () => void;
  onSwing: () => void;
  onTake: () => void;
  onReset: () => void;
  gameData: {
    isTop: boolean;
  };
}

function GameControls({
  gameState,
  gameOver,
  lastResult,
  onPitch,
  onSwing,
  onTake,
  gameData,
}: GameControlsProps) {
  const getResultMessage = () => {
    switch (lastResult) {
      case 'strike': return 'STRIKE!';
      case 'ball': return 'BALL!';
      case 'hit': return 'BASE HIT!';
      case 'homerun': return 'HOME RUN!';
      case 'foul': return 'FOUL BALL!';
      case 'out': return 'OUT!';
      default: return '';
    }
  };

  const getResultClass = () => {
    switch (lastResult) {
      case 'strike':
      case 'out': return 'result-bad';
      case 'ball': return 'result-neutral';
      case 'hit':
      case 'homerun': return 'result-good';
      case 'foul': return 'result-neutral';
      default: return '';
    }
  };

  return (
    <div className="game-controls">
      <div className="status-panel">
        <div className="batting-indicator">
          <span className="batting-label">NOW BATTING</span>
          <span className="batting-team">{gameData.isTop ? 'VISITORS' : 'HOME'}</span>
        </div>

        {lastResult && (
          <div className={`result-display ${getResultClass()}`}>
            <div className="result-bulbs">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="result-bulb" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
            <span className="result-text">{getResultMessage()}</span>
            <div className="result-bulbs">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="result-bulb" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="controls-panel">
        {gameState === 'waiting' && !gameOver && (
          <button className="control-btn pitch-btn" onClick={onPitch}>
            <span className="btn-icon">⚾</span>
            <span className="btn-text">PITCH</span>
            <span className="btn-hint">[SPACE]</span>
          </button>
        )}

        {gameState === 'pitching' && (
          <div className="pitching-indicator">
            <div className="pitch-animation">
              <div className="wind-up"></div>
            </div>
            <span>INCOMING...</span>
          </div>
        )}

        {gameState === 'batting' && (
          <div className="batting-controls">
            <button className="control-btn swing-btn" onClick={onSwing}>
              <span className="btn-icon">🏏</span>
              <span className="btn-text">SWING!</span>
              <span className="btn-hint">[SPACE]</span>
            </button>
            <button className="control-btn take-btn" onClick={onTake}>
              <span className="btn-icon">👁</span>
              <span className="btn-text">TAKE</span>
              <span className="btn-hint">[T]</span>
            </button>
          </div>
        )}

        {gameState === 'result' && (
          <div className="result-wait">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="instructions-panel">
        <div className="instruction">
          <kbd>SPACE</kbd>
          <span>Pitch / Swing</span>
        </div>
        <div className="instruction">
          <kbd>T</kbd>
          <span>Take pitch</span>
        </div>
      </div>
    </div>
  );
}

export default GameControls;
