import { useState, useRef } from "react";
import Explosion from "./Explosion";
import styles from "./QuestionCard.module.css";
import PropTypes from "prop-types";

const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [explosion, setExplosion] = useState(null);
  const correctSound = useRef(new Audio("/correct.mp3"));
  const wrongSound = useRef(new Audio("/wrong.mp3"));

  const handleAnswerClick = (index, event) => {
    onSelectAnswer(index);
    const isCorrect = index === question.correctAnswer;
    playFeedback(isCorrect, event);
  };

  const handleNumberSubmit = (event) => {
    event.preventDefault();
    const userAnswer = parseInt(inputValue, 10);
    const isCorrect = userAnswer === question.correctAnswer;
    playFeedback(isCorrect, event.target);
    onSelectAnswer(userAnswer);
  };

  const playFeedback = (isCorrect, element) => {
    if (isCorrect) {
      correctSound.current.play();
      const rect = element.getBoundingClientRect();
      setExplosion({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      wrongSound.current.play();
    }
  };

  if (question.type === "number") {
    const isCorrect =
      showFeedback && parseInt(inputValue, 10) === question.correctAnswer;
    const isWrong =
      showFeedback && parseInt(inputValue, 10) !== question.correctAnswer;

    return (
      <div className={styles.card}>
        <h2 className={styles.question}>{question.text}</h2>
        <form onSubmit={handleNumberSubmit} className={styles.numberForm}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={showFeedback}
            className={`${styles.numberInput} 
              ${isCorrect ? styles.correct : ""}
              ${isWrong ? styles.wrong : ""}`}
            placeholder="Enter your answer"
          />
          <button
            type="submit"
            disabled={showFeedback || !inputValue}
            className={styles.submitButton}
          >
            Submit
          </button>
        </form>
        {showFeedback && (
          <div className={styles.feedback}>
            Correct answer: {question.correctAnswer}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{question.text}</h2>
      <div className={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isCorrect = showFeedback && index === question.correctAnswer;
          const isWrong =
            showFeedback &&
            selectedAnswer === index &&
            index !== question.correctAnswer;

          {
            /* isCorrect is for rendering green background  and isWrong is for rendering red 
            background based on user selection and the correct answer*/
          }

          return (
            <button
              key={index}
              onClick={(e) => handleAnswerClick(index, e)}
              disabled={showFeedback}
              className={`${styles.option} 
                ${selectedAnswer === index ? styles.selected : ""}
                ${isCorrect ? styles.correct : ""}
                ${isWrong ? styles.wrong : ""} `}
            >
              {option}
            </button>
          );
        })}
      </div>
      {explosion && (
        <Explosion
          x={explosion.x}
          y={explosion.y}
          onComplete={() => setExplosion(null)}
        />
      )}
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["number", "multiple"]).isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
  }).isRequired,
  selectedAnswer: PropTypes.number,
  onSelectAnswer: PropTypes.func.isRequired,
  showFeedback: PropTypes.bool.isRequired,
};

export default QuestionCard;
