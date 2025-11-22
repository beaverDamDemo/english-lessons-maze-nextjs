// app/maze/lesson5/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Which is a preposition?',
    options: ['happy', 'run', 'in', 'quickly'],
    answer: 2,
  },
  {
    q: 'Complete: "The book is _____ the table".',
    options: ['at', 'on', 'in', 'with'],
    answer: 1,
  },
  {
    q: 'Choose the correct preposition: "I am interested _____ music".',
    options: ['in', 'on', 'at', 'with'],
    answer: 0,
  },
  {
    q: 'Which preposition shows time?',
    options: ['under', 'at', 'near', 'before'],
    answer: 1,
  },
  {
    q: 'Fill in: "She came _____ the room".',
    options: ['to', 'in', 'into', 'inside'],
    answer: 2,
  },
  {
    q: 'What preposition means "no more than"?',
    options: ['within', 'under', 'about', 'during'],
    answer: 1,
  },
  {
    q: 'Complete: "I will meet you _____ noon".',
    options: ['at', 'in', 'on', 'by'],
    answer: 0,
  },
  {
    q: 'Choose: "They walked _____ the park".',
    options: ['through', 'along', 'across', 'over'],
    answer: 0,
  },
  {
    q: 'Which preposition shows direction?',
    options: ['during', 'toward', 'since', 'before'],
    answer: 1,
  },
  {
    q: 'Fill in: "The cat is hiding _____ the bed".',
    options: ['under', 'above', 'on', 'at'],
    answer: 0,
  },
  {
    q: 'Complete: "I have been here _____ Monday".',
    options: ['since', 'for', 'until', 'during'],
    answer: 0,
  },
  {
    q: 'Choose the right preposition: "She is afraid _____ dogs".',
    options: ['from', 'of', 'by', 'with'],
    answer: 1,
  },
  {
    q: 'What comes after "according _____ "?',
    options: ['of', 'to', 'in', 'at'],
    answer: 1,
  },
  {
    q: 'Fill: "He is waiting _____ his friend".',
    options: ['for', 'to', 'at', 'of'],
    answer: 0,
  },
  {
    q: 'Which preposition means "during"?',
    options: ['at', 'during', 'for', 'until'],
    answer: 1,
  },
  {
    q: 'Complete: "I am tired _____ waiting".',
    options: ['at', 'of', 'from', 'with'],
    answer: 1,
  },
  {
    q: 'Choose: "She is similar _____ her mother".',
    options: ['to', 'with', 'like', 'as'],
    answer: 0,
  },
  {
    q: 'What preposition follows "be aware"?',
    options: ['of', 'to', 'from', 'in'],
    answer: 0,
  },
  {
    q: 'Fill: "The keys are _____ the drawer".',
    options: ['in', 'on', 'at', 'by'],
    answer: 0,
  },
  {
    q: 'Choose: "I will see you _____ Friday".',
    options: ['at', 'on', 'in', 'by'],
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
