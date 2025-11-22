// app/maze/lesson6/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Which is a conjunction?',
    options: ['happy', 'and', 'run', 'quickly'],
    answer: 1,
  },
  {
    q: 'Choose the correct conjunction: "I like apples _____ oranges".',
    options: ['and', 'but', 'or', 'because'],
    answer: 0,
  },
  {
    q: 'What conjunction shows contrast?',
    options: ['and', 'or', 'but', 'so'],
    answer: 2,
  },
  {
    q: 'Complete: "He wanted to go, _____ he was tired".',
    options: ['and', 'because', 'but', 'or'],
    answer: 2,
  },
  {
    q: 'Which conjunction introduces a reason?',
    options: ['and', 'because', 'but', 'or'],
    answer: 1,
  },
  {
    q: 'Fill: "You can have tea _____ coffee".',
    options: ['and', 'or', 'but', 'because'],
    answer: 1,
  },
  {
    q: 'What conjunction connects similar ideas?',
    options: ['but', 'because', 'and', 'although'],
    answer: 2,
  },
  {
    q: 'Choose: "She studied hard, _____ she passed the exam".',
    options: ['so', 'because', 'but', 'or'],
    answer: 0,
  },
  {
    q: 'Complete: "Although it was raining, _____ we went outside".',
    options: ['and', 'so', 'yet', 'because'],
    answer: 2,
  },
  {
    q: 'Which is a coordinating conjunction?',
    options: ['because', 'although', 'and', 'since'],
    answer: 2,
  },
  {
    q: 'Fill: "I wanted to come, _____ I was sick".',
    options: ['and', 'but', 'because', 'so'],
    answer: 2,
  },
  {
    q: 'What conjunction shows consequence?',
    options: ['because', 'therefore', 'although', 'when'],
    answer: 1,
  },
  {
    q: 'Choose: "He is intelligent _____ hardworking".',
    options: ['and', 'or', 'but', 'because'],
    answer: 0,
  },
  {
    q: 'Complete: "We need money, _____ we are saving".',
    options: ['so', 'because', 'but', 'and'],
    answer: 0,
  },
  {
    q: 'Which conjunction shows time?',
    options: ['because', 'when', 'and', 'or'],
    answer: 1,
  },
  {
    q: 'Fill: "Do you prefer cats _____ dogs?"',
    options: ['and', 'or', 'but', 'because'],
    answer: 1,
  },
  {
    q: 'What conjunction means "in addition"?',
    options: ['moreover', 'but', 'or', 'although'],
    answer: 0,
  },
  {
    q: 'Choose: "I like reading, _____ I do not like writing".',
    options: ['and', 'but', 'or', 'because'],
    answer: 1,
  },
  {
    q: 'Complete: "_____ the door was locked, we could not enter".',
    options: ['Because', 'Although', 'And', 'Or'],
    answer: 0,
  },
  {
    q: 'Which conjunction introduces a condition?',
    options: ['because', 'if', 'and', 'but'],
    answer: 1,
  },
];

export default function Quiz({
  onComplete,
  primaryColor = '#4CAF50',
}: {
  onComplete: (score: number) => void;
  primaryColor?: string;
}) {
  const [selectedQuestions] = useState(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
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
    <div style={{ padding: '0' }}>
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
          <div
            style={{
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              width: '100px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: primaryColor,
                width: `${((current + 1) / selectedQuestions.length) * 100}%`,
                transition: 'width 0.3s ease',
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
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.filter = 'brightness(0.9)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
