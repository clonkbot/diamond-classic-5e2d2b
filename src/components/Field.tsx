import { useEffect, useState } from 'react';
import './Field.css';
import type { PitchResult } from '../App';

interface FieldProps {
  bases: [boolean, boolean, boolean];
  lastResult: PitchResult;
}

function Field({ bases, lastResult }: FieldProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (lastResult === 'hit' || lastResult === 'homerun') {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  return (
    <div className="field-container">
      <div className="field">
        <div className="outfield">
          <div className="outfield-grass"></div>
          <div className="warning-track"></div>
          <div className="fence">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="fence-section" />
            ))}
          </div>
        </div>

        <div className="infield">
          <div className="infield-grass"></div>
          <div className="infield-dirt"></div>

          <div className="basepath first-to-second"></div>
          <div className="basepath second-to-third"></div>
          <div className="basepath third-to-home"></div>
          <div className="basepath home-to-first"></div>

          <div className={`base second ${bases[1] ? 'occupied' : ''}`}>
            <div className="base-diamond"></div>
            {bases[1] && <div className="runner"></div>}
          </div>

          <div className={`base third ${bases[2] ? 'occupied' : ''}`}>
            <div className="base-diamond"></div>
            {bases[2] && <div className="runner"></div>}
          </div>

          <div className={`base first ${bases[0] ? 'occupied' : ''}`}>
            <div className="base-diamond"></div>
            {bases[0] && <div className="runner"></div>}
          </div>

          <div className="home-plate">
            <div className="plate-shape"></div>
            <div className="batter-box left"></div>
            <div className="batter-box right"></div>
          </div>

          <div className="pitchers-mound">
            <div className="mound-dirt"></div>
            <div className="rubber"></div>
          </div>
        </div>

        {showAnimation && lastResult === 'homerun' && (
          <div className="homerun-animation">
            <div className="ball-trail">
              <div className="flying-ball"></div>
            </div>
            <div className="fireworks">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="firework" style={{
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.15}s`
                }}></div>
              ))}
            </div>
          </div>
        )}

        {showAnimation && lastResult === 'hit' && (
          <div className="hit-animation">
            <div className="ground-ball"></div>
          </div>
        )}
      </div>

      <div className="field-label">DIAMOND VIEW</div>
    </div>
  );
}

export default Field;
