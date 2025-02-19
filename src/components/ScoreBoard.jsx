import PropTypes from "prop-types";
import { Trophy } from "lucide-react";
import styles from "./ScoreBoard.module.css";

const ScoreBoard = ({ attempts, onStartNewQuiz }) => {
  const latestAttempt = attempts[attempts.length - 1];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Trophy className={styles.trophy} />
        <h2 className={styles.title}>Quiz Complete!</h2>
        <p className={styles.score}>
          Your score:{" "}
          <span className={styles.scoreValue}>
            {latestAttempt?.score || 0}%
          </span>
        </p>
      </div>

      <div className={styles.historySection}>
        <h3 className={styles.historyTitle}>Previous Attempts</h3>
        <div className={styles.attemptsList}>
          {attempts
            .slice()
            .reverse()
            .map((attempt) => (
              <div key={attempt.id} className={styles.attemptItem}>
                <span>{new Date(attempt.date).toLocaleDateString()}</span>
                <span className={styles.scoreValue}>{attempt.score}%</span>
              </div>
            ))}
        </div>
      </div>

      <button onClick={onStartNewQuiz} className={styles.newQuizButton}>
        Start New Quiz
      </button>
    </div>
  );
};

ScoreBoard.propTypes = {
  attempts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      score: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStartNewQuiz: PropTypes.func.isRequired,
};

export default ScoreBoard;
