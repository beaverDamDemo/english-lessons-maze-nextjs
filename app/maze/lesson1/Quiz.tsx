// app/maze/lesson1/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Lorem ipsum dolor sit amet. What is the correct answer?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Consectetur adipiscing elit. Which one is right?',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Sed do eiusmod tempor. Pick the right one.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Incididunt ut labore et dolore. What should you pick?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Magna aliqua ut enim. Where is the answer?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Ad minim veniam quis. Find the correct one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Nostrud exercitation ullamco. Pick the right choice.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Laboris nisi ut aliquip. Select the answer.',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Ex ea commodo consequat. Which is correct?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Duis aute irure dolor. Pick this one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'In reprehenderit in voluptate. Choose wisely.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Velit esse cillum dolore. What is the answer?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Eu fugiat nulla pariatur. Can you find it?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Excepteur sint occaecat cupidatat non. Pick correctly.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Proident sunt in culpa qui officia. Make your choice.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Deserunt mollit anim id est laborum. What is right?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Sed ut perspiciatis unde omnis iste. Pick the answer.',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Natus error sit voluptatem accusantium. Choose one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Doloremque laudantium totam rem aperiam. Which one?',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Eaque ipsa quae ab illo inventore. Pick this.',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Veritatis et quasi architecto beatae vitae. Got it?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
];

export default function Quiz({
  onComplete,
  primaryColor = '#4CAF50',
}: {
  onComplete: (score: number) => void;
  primaryColor?: string;
}) {
  // Select only 5 random questions from the full question bank
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
