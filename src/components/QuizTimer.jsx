import { useEffect } from "react";
import { Timer } from "lucide-react";
import PropTypes from "prop-types";
import styles from "./QuizTimer.module.css";

const QuizTimer = ({ timeRemaining, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className={styles.timer}>
      <Timer className={styles.icon} />
      <span>{Math.max(0, timeRemaining)}s</span>
    </div>
  );
};

QuizTimer.propTypes = {
  timeRemaining: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
};

export default QuizTimer;
