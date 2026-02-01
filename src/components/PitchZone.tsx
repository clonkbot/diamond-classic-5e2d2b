import './PitchZone.css';
import type { GameState } from '../App';

interface PitchZoneProps {
  pitchLocation: { x: number; y: number } | null;
  gameState: GameState;
  swingTiming: number | null;
}

function PitchZone({ pitchLocation, gameState, swingTiming }: PitchZoneProps) {
  const isInZone = pitchLocation &&
    pitchLocation.x > 20 && pitchLocation.x < 80 &&
    pitchLocation.y > 20 && pitchLocation.y < 80;

  return (
    <div className="pitch-zone-container">
      <div className="zone-header">
        <span className="zone-label">STRIKE ZONE</span>
        <div className="zone-lights">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`zone-indicator ${gameState === 'batting' ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <div className="pitch-zone">
        <div className="zone-frame">
          <div className="corner tl"></div>
          <div className="corner tr"></div>
          <div className="corner bl"></div>
          <div className="corner br"></div>
        </div>

        <div className="strike-zone">
          <div className="zone-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="zone-cell" />
            ))}
          </div>
        </div>

        {pitchLocation && (
          <div
            className={`baseball ${gameState === 'pitching' ? 'incoming' : ''} ${isInZone ? 'in-zone' : 'out-zone'}`}
            style={{
              left: `${pitchLocation.x}%`,
              top: `${pitchLocation.y}%`,
            }}
          >
            <div className="ball-core"></div>
            <div className="ball-seam"></div>
          </div>
        )}

        {swingTiming !== null && (
          <div className="bat-swing">
            <div className="bat"></div>
          </div>
        )}

        <div className="catcher-mitt">
          <div className="mitt-shape"></div>
        </div>
      </div>

      <div className="zone-footer">
        <span className="view-label">CATCHER&apos;S VIEW</span>
      </div>
    </div>
  );
}

export default PitchZone;
