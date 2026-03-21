'use client';

import { useState } from 'react';
import styles from '../_components/QuizButtons.module.css';

const questions = [
  {
    q: 'Dummy check: choose option A to continue.',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 0,
  },
  {
    q: 'Dummy check: pick the first answer.',
    options: ['First', 'Second', 'Third', 'Fourth'],
    answer: 0,
  },
  {
    q: 'Dummy check: which button is correct?',
    options: ['This one', 'Not this', 'Not this either', 'Nope'],
    answer: 0,
  },
];

export default function Quiz({
  onComplete,
  primaryColor = '#795548',
}: {
  onComplete: (score: number) => void;
  primaryColor?: string;
}) {
  const [selectedQuestions] = useState(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 1);
  });

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(index: number) {
    let newScore = score;
    if (index === selectedQuestions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    const nextQuestion = current + 1;

    if (nextQuestion >= selectedQuestions.length) {
      setFinished(true);
      onComplete(newScore);
    } else {
      setCurrent(nextQuestion);
    }
  }

  if (finished) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2
          style={{
            color: primaryColor,
            fontSize: '24px',
            margin: '0 0 15px 0',
          }}
        >
          Quiz Complete!
        </h2>
        <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
          You got {score} out of {selectedQuestions.length} correct answers.
        </p>
        <p
          style={{
            fontSize: '16px',
            color: primaryColor,
            margin: '10px 0',
            fontWeight: 'bold',
          }}
        >
          You will have {score} move{score !== 1 ? 's' : ''} to continue the
          maze!
        </p>
      </div>
    );
  }

  return (
    <div
      key={current}
      className={styles.questionSlide}
      style={{ padding: '0' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#666',
            }}
          >
            Question {current + 1} of {selectedQuestions.length}
          </p>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                backgroundColor: primaryColor,
                width: `${(current / selectedQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <p
          style={{
            margin: '15px 0',
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
          }}
        >
          {selectedQuestions[current].q}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {selectedQuestions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={styles.quizOptionButton}
            style={{ backgroundColor: primaryColor }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
