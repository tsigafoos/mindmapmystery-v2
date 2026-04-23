import type { RevealedClue } from '../../types/game';
import { getCategoryLabel, categorizeWord, CATEGORY_BASE_COLORS } from '../../utils/thematicColors';
import type { WordCategory } from '../../types/game';

interface ProgressPanelProps {
  revealedClues: RevealedClue[];
  revealedCount: number;
  totalNodes: number;
  isGameOver: boolean;
  isWinner: boolean;
}

export default function ProgressPanel({
  revealedClues,
  revealedCount,
  totalNodes,
  isGameOver,
  isWinner,
}: ProgressPanelProps) {
  // Sort clues by strength (strongest first)
  const sortedClues = [...revealedClues].sort((a, b) =>
    b.relationshipStrength - a.relationshipStrength
  );

  // Get category for each revealed word
  const getWordCategory = (word: string): WordCategory => {
    return categorizeWord(word);
  };

  // Get color for legend
  const getCategoryColor = (category: WordCategory): string => {
    const color = CATEGORY_BASE_COLORS[category];
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  return (
    <div className="progress-panel">
      <h3 className="panel-title">Revealed Clues</h3>

      {/* Progress Stats */}
      <div className="progress-stats">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(revealedCount / totalNodes) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {revealedCount} / {totalNodes} revealed
          </span>
        </div>
      </div>

      {/* Game Status */}
      {isGameOver && (
        <div className={`game-status ${isWinner ? 'winner' : 'loser'}`}>
          {isWinner ? '🎉 You Won!' : '⏰ Time\'s Up'}
        </div>
      )}

      {/* Clues List */}
      <div className="clues-list">
        {sortedClues.length === 0 ? (
          <div className="no-clues">
            <span className="no-clues-icon">🔍</span>
            <p>Click on glowing nodes in the 3D space to reveal clues about the mystery word.</p>
          </div>
        ) : (
          sortedClues.map((clue, index) => {
            const category = getWordCategory(clue.word);
            return (
              <div key={index} className="clue-card">
                <div className="clue-word">{clue.word}</div>
                <div className="clue-meta">
                  <span
                    className="clue-category"
                    style={{ color: getCategoryColor(category) }}
                  >
                    {getCategoryLabel(category)}
                  </span>
                  <span className="clue-relevance">
                    {Math.round(clue.relationshipStrength * 100)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category Legend */}
      <div className="legend">
        <h4 className="legend-title">Thematic Colors</h4>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('biology') }}
          />
          <span>Biology / Nature</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('science') }}
          />
          <span>Science / Physics</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('technology') }}
          />
          <span>Technology</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('sports') }}
          />
          <span>Sports / Movement</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('food') }}
          />
          <span>Food / Cooking</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('arts') }}
          />
          <span>Arts / Culture</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('business') }}
          />
          <span>Business / Strategy</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('abstract') }}
          />
          <span>Abstract / Emotions</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: getCategoryColor('uncategorized') }}
          />
          <span>General</span>
        </div>
      </div>

      {/* Legend Note */}
      <div className="legend-note">
        <p>💡 Brighter = Stronger connection to mystery word</p>
        <p>💡 Gray nodes = Already revealed clues</p>
      </div>
    </div>
  );
}
