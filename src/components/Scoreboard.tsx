import './Scoreboard.css';

interface ScoreboardProps {
  gameData: {
    inning: number;
    isTop: boolean;
    strikes: number;
    balls: number;
    outs: number;
    homeScore: number;
    awayScore: number;
  };
}

function Scoreboard({ gameData }: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-frame">
        <div className="scoreboard-rivets">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rivet" />
          ))}
        </div>

        <div className="scoreboard-header">
          <div className="inning-display">
            <span className="inning-label">INNING</span>
            <div className="inning-number">
              <span className="inning-value">{gameData.inning}</span>
              <span className="inning-half">{gameData.isTop ? '▲' : '▼'}</span>
            </div>
          </div>
        </div>

        <div className="score-section">
          <div className="team-row">
            <span className="team-name">VISITORS</span>
            <div className="score-display">
              {String(gameData.awayScore).padStart(2, '0').split('').map((digit, i) => (
                <span key={i} className="score-digit">{digit}</span>
              ))}
            </div>
          </div>
          <div className="team-row home">
            <span className="team-name">HOME</span>
            <div className="score-display">
              {String(gameData.homeScore).padStart(2, '0').split('').map((digit, i) => (
                <span key={i} className="score-digit">{digit}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="count-section">
          <div className="count-row">
            <span className="count-label">B</span>
            <div className="indicator-lights">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`indicator-bulb ball ${i < gameData.balls ? 'lit' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="count-row">
            <span className="count-label">S</span>
            <div className="indicator-lights">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`indicator-bulb strike ${i < gameData.strikes ? 'lit' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="count-row">
            <span className="count-label">O</span>
            <div className="indicator-lights">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`indicator-bulb out ${i < gameData.outs ? 'lit' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
