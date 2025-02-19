import { useState, useEffect } from "react";
import QuestionCard from "./components/QuestionCard";
import QuizTimer from "./components/QuizTimer";
import ScoreBoard from "./components/ScoreBoard";
import { questions } from "./data/questions";
import { QuizDB } from "./utils/db";
import styles from "./App.module.css";

const SECONDS_PER_QUESTION = 30;
const db = new QuizDB();

function App() {
  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: SECONDS_PER_QUESTION,
    isComplete: false,
  });
  const [attempts, setAttempts] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    db.init().then(() => {
      db.getAttempts().then(setAttempts);
    });
  }, []);

  useEffect(() => {
    if (quizState.isComplete || showFeedback) return;

    const timer = setInterval(() => {
      setQuizState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.isComplete, showFeedback]);

  const handleAnswer = (answer) => {
    setShowFeedback(true);
    setQuizState((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
    }));

    setTimeout(() => {
      setShowFeedback(false);
      setQuizState((prev) => {
        const isLastQuestion =
          prev.currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
          const score = Math.round(
            (quizState.answers.filter((ans, i) => {
              const question = questions[i];
              return question.type === "number"
                ? ans === question.correctAnswer
                : ans === question.correctAnswer;
            }).length /
              questions.length) *
              100
          );

          const attempt = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            score,
            timePerQuestion: quizState.answers.map(
              () => SECONDS_PER_QUESTION - prev.timeRemaining
            ),
          };

          db.saveAttempt(attempt).then(() => {
            setAttempts((prevAttempts) => [...prevAttempts, attempt]);
          });

          return {
            ...prev,
            isComplete: true,
          };
        }

        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: SECONDS_PER_QUESTION,
        };
      });
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!showFeedback) {
      handleAnswer(-1);
    }
  };

  const startNewQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: SECONDS_PER_QUESTION,
      isComplete: false,
    });
  };

  if (quizState.isComplete) {
    return (
      <div className={styles.container}>
        <ScoreBoard attempts={attempts} onStartNewQuiz={startNewQuiz} />
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <div className={styles.quizInfo}>
          <span className={styles.questionCounter}>
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </span>
          <QuizTimer
            timeRemaining={quizState.timeRemaining}
            onTimeUp={handleTimeUp}
          />
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${
                (quizState.currentQuestionIndex / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
      {/* question card is render withat aparticular question */}
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={
          quizState.answers[quizState.currentQuestionIndex] ?? null
        }
        onSelectAnswer={handleAnswer}
        showFeedback={showFeedback}
      />
    </div>
  );
}

export default App;
