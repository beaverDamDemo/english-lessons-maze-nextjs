// app/maze/lesson4/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Which is a noun?',
    options: ['run', 'beautiful', 'cat', 'quickly'],
    answer: 2,
  },
  {
    q: 'What is a common noun?',
    options: ['John', 'London', 'teacher', 'Paris'],
    answer: 2,
  },
  {
    q: 'Choose the proper noun:',
    options: ['day', 'Monday', 'week', 'month'],
    answer: 1,
  },
  {
    q: 'Which is a plural noun?',
    options: ['cat', 'dog', 'children', 'flower'],
    answer: 2,
  },
  {
    q: 'What is the plural of "box"?',
    options: ['boxe', 'boxs', 'boxes', 'box'],
    answer: 2,
  },
  {
    q: 'Identify the noun: "The teacher taught the class".',
    options: ['taught', 'class', 'the', 'teacher'],
    answer: 3,
  },
  {
    q: 'Which word is a countable noun?',
    options: ['water', 'sand', 'book', 'air'],
    answer: 2,
  },
  {
    q: 'Choose an uncountable noun:',
    options: ['apple', 'milk', 'chair', 'car'],
    answer: 1,
  },
  {
    q: 'What is the singular of "children"?',
    options: ['children', 'child', 'childs', 'childes'],
    answer: 1,
  },
  {
    q: 'Which is a concrete noun?',
    options: ['happiness', 'love', 'table', 'truth'],
    answer: 2,
  },
  {
    q: 'Identify the abstract noun:',
    options: ['book', 'freedom', 'car', 'house'],
    answer: 1,
  },
  {
    q: 'What is the plural of "person"?',
    options: ['persons', 'peoples', 'people', 'personnes'],
    answer: 2,
  },
  {
    q: 'Choose the collective noun:',
    options: ['dog', 'group', 'happy', 'run'],
    answer: 1,
  },
  {
    q: 'Which is a possessive noun form?',
    options: ['Johns', "John's", "Johns'", "john's"],
    answer: 1,
  },
  {
    q: 'Identify the noun in this sentence: "She enjoys reading books".',
    options: ['enjoys', 'reading', 'books', 'she'],
    answer: 2,
  },
  {
    q: 'What is the plural of "tooth"?',
    options: ['tooths', 'teeth', 'tooth', 'teeths'],
    answer: 1,
  },
  {
    q: 'Which is a mass noun?',
    options: ['cat', 'flour', 'book', 'tree'],
    answer: 1,
  },
  {
    q: 'Choose the noun: "Run quickly to the store".',
    options: ['run', 'quickly', 'store', 'to'],
    answer: 2,
  },
  {
    q: 'What does a noun represent?',
    options: ['action', 'description', 'person, place or thing', 'quality'],
    answer: 2,
  },
  {
    q: 'Identify the compound noun:',
    options: ['beautiful', 'sunshine', 'quickly', 'slowly'],
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
